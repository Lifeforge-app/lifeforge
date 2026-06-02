import { default as _validateOTP } from '@functions/auth/validateOTP'
import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import forge from '../forge'
import userSchemas from '../schema'
import { removeSensitiveData, updateNullData } from '../utils/auth'

export const validateOTP = forge
  .mutation({
    description: 'Verify one-time password',
    encrypted: false,
    input: {
      body: z.object({
        otp: z.string(),
        otpId: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.ok(await _validateOTP(pb, body))
  )

export const generateOTP = forge
  .query({
    description: 'Generate one-time password',
    encrypted: false,
    input: {},
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      (
        await pb.instance
          .collection('users')
          .requestOTP(pb.instance.authStore.record?.email)
      ).otpId
    )
  )

export const login = forge
  .mutation({
    description: 'Authenticate user with credentials',
    noAuth: true,
    input: {
      body: z.object({
        email: z.string(),
        password: z.string()
      })
    },
    output: {
      OK: z.union([
        z.object({
          state: z.literal('2fa_required'),
          tid: z.string()
        }),
        z.object({
          state: z.literal('success'),
          session: z.string()
        })
      ]),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { email, password }, response }) => {
    const pb = new PocketBase(process.env.PB_HOST)

    let failed = false

    await pb
      .collection('users')
      .authWithPassword(email, password)
      .catch(() => {
        failed = true
      })

    if (pb.authStore.isValid && !failed) {
      const userData = pb.authStore.record

      if (!userData) {
        return response.unauthorized()
      }

      const sanitizedUserData = removeSensitiveData(userData)

      if (sanitizedUserData.twoFAEnabled) {
        currentSession.token = pb.authStore.token
        currentSession.tokenExpireAt = dayjs().add(5, 'minutes').toISOString()
        currentSession.tokenId = v4()

        return response.ok({
          state: '2fa_required' as const,
          tid: currentSession.tokenId
        })
      }

      await updateNullData(sanitizedUserData, pb)

      return response.ok({
        state: 'success' as const,
        session: pb.authStore.token
      })
    } else {
      return response.unauthorized()
    }
  })

export const verifySessionToken = forge
  .mutation({
    description: 'Validate user session token',
    encrypted: false,
    input: {},
    output: {
      OK: z.boolean(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ req, response }) => {
    const bearerToken = req.headers.authorization?.split(' ')[1].trim()

    const pb = new PocketBase(process.env.PB_HOST)

    if (!bearerToken) {
      return response.unauthorized()
    }

    pb.authStore.save(bearerToken, null)
    await pb
      .collection('users')
      .authRefresh()
      .catch(() => {})

    if (!pb.authStore.isValid) {
      return response.unauthorized()
    }

    if (!pb.authStore.record) {
      return response.unauthorized()
    }

    return response.ok(true)
  })

export const getUserData = forge
  .query({
    description: 'Get current user data',
    input: {},
    output: {
      OK: userSchemas.users.omit({
        masterPasswordHash: true,
        APIKeysMasterPasswordHash: true,
        twoFASecret: true
      }).extend({
        hasMasterPassword: z.boolean(),
        hasJournalMasterPassword: z.boolean(),
        hasAPIKeysMasterPassword: z.boolean(),
        twoFAEnabled: z.boolean()
      }),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, response }) => {
    const userData = pb.instance.authStore.record

    if (!userData) {
      return response.notFound()
    }

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb.instance)

    return response.ok(sanitizedUserData)
  })

export const createFirstUser = forge
  .mutation({
    description: 'Create the first user (only works when no users exist)',
    noAuth: true,
    input: {
      body: z.object({
        email: z.string().email(),
        username: z.string().min(3),
        name: z.string().min(1),
        password: z.string().min(8)
      })
    },
    output: {
      CREATED: z.object({
        state: z.literal('success')
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ body: { email, username, name, password }, response }) => {
    const config = validateEnvironmentVariables()

    const superPBInstance = await connectToPocketBase(config)

    const users = await superPBInstance.collection('users').getFullList()

    if (users.length > 0) {
      return response.badRequest('Users already exist')
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

    return response.created({
      state: 'success' as const
    })
  })
