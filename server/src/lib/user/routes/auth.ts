import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import PocketBase from 'pocketbase'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'

const validateOTP = forgeController
  .mutation()
  .description('Validate OTP')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(({ pb, body }) => _validateOTP(pb, body))

const generateOTP = forgeController
  .query()
  .description('Generate OTP')
  .input({})
  .callback(
    async ({ pb }) =>
      (
        await pb.instance
          .collection('users')
          .requestOTP(pb.instance.authStore.record?.email)
      ).otpId
  )

const login = forgeController
  .mutation()
  .noAuth()
  .description('User login')
  .input({
    body: z.object({
      email: z.string(),
      password: z.string()
    })
  })
  .callback(async ({ body: { email, password } }) => {
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
        throw new ClientError('Invalid credentials', 401)
      }

      const sanitizedUserData = removeSensitiveData(userData)

      if (sanitizedUserData.twoFAEnabled) {
        currentSession.token = pb.authStore.token
        currentSession.tokenExpireAt = moment().add(5, 'minutes').toISOString()
        currentSession.tokenId = v4()

        return {
          state: '2fa_required' as const,
          tid: currentSession.tokenId
        }
      }

      await updateNullData(sanitizedUserData, pb)

      return {
        state: 'success' as const,
        session: pb.authStore.token,
        userData: sanitizedUserData
      }
    } else {
      throw new ClientError('Invalid credentials', 401)
    }
  })

const verifySessionToken = forgeController
  .mutation()
  .description('Verify session token')
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
      .catch(() => {})

    if (!pb.authStore.isValid) {
      throw new ClientError('Invalid session', 401)
    }

    const userData = pb.authStore.record

    if (!userData) {
      throw new ClientError('Invalid session', 401)
    }

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb)

    return {
      session: pb.authStore.token,
      userData: sanitizedUserData
    }
  })

export default forgeRouter({
  validateOTP,
  generateOTP,
  login,
  verifySessionToken
})
