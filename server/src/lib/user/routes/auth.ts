import { ClientError } from '@lifeforge/server-utils'
import { createLogger } from '@lifeforge/log'
import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import { v4 } from 'uuid'
import z from 'zod'

import { default as _validateOTP } from '@functions/auth/validateOTP'
import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'
import forge from '../forge'

const logger = createLogger({ name: 'auth' })

export const validateOTP = forge
  .mutation()
  .noEncryption()
  .description('Verify one-time password')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(({ pb, body }) => _validateOTP(pb, body))

export const generateOTP = forge
  .query()
  .noEncryption()
  .description('Generate one-time password')
  .input({})
  .callback(
    async ({ pb }) =>
      (
        await pb.instance
          .collection('users')
          .requestOTP(pb.instance.authStore.record?.email)
      ).otpId
  )

export const login = forge
  .mutation()
  .noAuth()
  .description('Authenticate user with credentials')
  .input({
    body: z.object({
      email: z.string(),
      password: z.string()
    })
  })
  .callback(async ({ body: { email, password } }) => {
    const pbHost = process.env.PB_HOST
    if (!pbHost) {
      throw new ClientError('Server configuration error', 500)
    }

    const pb = new PocketBase(pbHost)

    let failed = false
    let authError: Error | null = null

    await pb
      .collection('users')
      .authWithPassword(email, password)
      .catch((error) => {
        failed = true
        authError = error instanceof Error ? error : new Error(String(error))
        logger.warn('Authentication failed', { email, error: authError.message })
      })

    if (pb.authStore.isValid && !failed) {
      const userData = pb.authStore.record

      if (!userData) {
        throw new ClientError('Invalid credentials', 401)
      }

      const sanitizedUserData = removeSensitiveData(userData)

      if (sanitizedUserData.twoFAEnabled) {
        currentSession.token = pb.authStore.token
        currentSession.tokenExpireAt = dayjs().add(5, 'minutes').toISOString()
        currentSession.tokenId = v4()

        return {
          state: '2fa_required' as const,
          tid: currentSession.tokenId
        }
      }

      await updateNullData(sanitizedUserData, pb)

      return {
        state: 'success' as const,
        session: pb.authStore.token
      }
    } else {
      throw new ClientError('Invalid credentials', 401)
    }
  })

export const verifySessionToken = forge
  .mutation()
  .noEncryption()
  .description('Validate user session token')
  .input({})
  .callback(async ({ req }) => {
    const bearerToken = req.headers.authorization?.split(' ')[1].trim()

    const pb = new PocketBase(process.env.PB_HOST)

    if (!bearerToken) {
      throw new ClientError('No token provided', 401)
    }

    pb.authStore.save(bearerToken, null)
    await pb
      .collection('users')
      .authRefresh()
      .catch((error) => {
        logger.warn('Session refresh failed', {
          error: error instanceof Error ? error.message : String(error)
        })
      })

    if (!pb.authStore.isValid) {
      throw new ClientError('Invalid session', 401)
    }

    if (!pb.authStore.record) {
      throw new ClientError('Invalid session', 401)
    }

    return true
  })

export const getUserData = forge
  .query()
  .description('Get current user data')
  .input({})
  .callback(async ({ pb }) => {
    const userData = pb.instance.authStore.record

    if (!userData) {
      throw new ClientError('User not found', 404)
    }

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb.instance)

    return sanitizedUserData
  })

export const createFirstUser = forge
  .mutation()
  .noAuth()
  .description('Create the first user (only works when no users exist)')
  .input({
    body: z.object({
      email: z.email(),
      username: z.string().min(3),
      name: z.string().min(1),
      password: z.string().min(8)
    })
  })
  .callback(async ({ body: { email, username, name, password } }) => {
    const config = validateEnvironmentVariables()

    const superPBInstance = await connectToPocketBase(config)

    const users = await superPBInstance.collection('users').getFullList()

    if (users.length > 0) {
      throw new ClientError('Users already exist', 400)
    }

    await superPBInstance.collection('users').create({
      email,
      username,
      name,
      verified: true,
      password,
      passwordConfirm: password,
      theme: 'system',
      language: 'en',
      fontScale: 1.0,
      borderRadiusMultiplier: 1.0
    })

    return {
      state: 'success' as const
    }
  })
