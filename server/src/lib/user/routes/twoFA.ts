import { ClientError } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

import { decrypt2, encrypt, encrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'

import { currentSession, twoFAStates } from '..'
import forge from '../forge'
import { removeSensitiveData, updateNullData } from '../utils/auth'
import { verifyAppOTP, verifyEmailOTP } from '../utils/otp'

// Generate a unique challenge per request with 5-minute expiration
function generateChallenge(): string {
  return v4()
}

export const getChallenge = forge
  .query()
  .description('Retrieve 2FA challenge token')
  .input({})
  .callback(async ({ pb }) => {
    const userId = pb.instance.authStore.record?.id

    const challenge = generateChallenge()

    // Store per-user challenge so subsequent calls (like generateAuthenticatorLink)
    // can reuse the same challenge value for encryption/decryption.
    if (userId) {
      twoFAStates.set(userId, {
        ...twoFAStates.get(userId),
        challenge,
        challengeExpiresAt: dayjs().add(5, 'minutes').toISOString()
      })
    }

    return challenge
  })

export const requestOTP = forge
  .query()
  .noAuth()
  .description('Request OTP for two-factor authentication')
  .input({
    query: z.object({
      email: z.string().email()
    })
  })
  .callback(async ({ pb, query: { email } }) => {
    const otp = await pb.instance
      .collection('users')
      .requestOTP(email)
      .catch(error => {
        throw new ClientError(
          `Failed to request OTP: ${error instanceof Error ? error.message : 'Unknown error'}`,
          400
        )
      })

    currentSession.tokenId = v4()
    currentSession.otpId = otp.otpId
    currentSession.tokenExpireAt = dayjs().add(5, 'minutes').toISOString()

    return currentSession.tokenId
  })

export const validateOTP = forge
  .mutation()
  .noAuth()
  .description('Verify OTP for two-factor authentication')
  .input({
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    })
  })
  .callback(async ({ pb, body }) => {
    const challenge = generateChallenge()
    if (await _validateOTP(pb, body, challenge)) {
      // Store per-user state instead of global state
      const userId = pb.instance.authStore.record?.id
      if (userId) {
        twoFAStates.set(userId, {
          canDisable: true,
          expiresAt: dayjs().add(5, 'minutes').toISOString()
        })
      }

      return true
    }

    return false
  })

export const generateAuthenticatorLink = forge
  .query()
  .description('Generate authenticator app setup link')
  .input({})
  .callback(
    async ({
      pb,
      req: {
        headers: { authorization }
      }
    }) => {
      const userId = pb.instance.authStore.record?.id
      const email = pb.instance.authStore.record?.email

      if (!userId || !email) {
        throw new ClientError('User not authenticated', 401)
      }

      if (!authorization) {
        throw new ClientError('Authorization header required', 401)
      }

      const tempCode = speakeasy.generateSecret({
        name: email,
        length: 32,
        issuer: 'LifeForge.'
      }).base32

      // Store per-user temp code instead of global
      twoFAStates.set(userId, {
        ...twoFAStates.get(userId),
        tempCode,
        tempCodeExpiresAt: dayjs().add(5, 'minutes').toISOString()
      })

      // Prefer an existing per-user challenge created via `getChallenge()`
      const existing = twoFAStates.get(userId)

      const challenge = existing?.challenge || generateChallenge()

      // If we generated a new challenge here, store it so the client can retrieve it
      if (!existing) {
        twoFAStates.set(userId, {
          ...twoFAStates.get(userId),
          challenge,
          challengeExpiresAt: dayjs().add(5, 'minutes').toISOString()
        })
      }

      return encrypt2(
        encrypt2(
          `otpauth://totp/${email}?secret=${tempCode}&issuer=LifeForge.`,
          challenge
        ),
        authorization.replace('Bearer ', '')
      )
    }
  )

export const verifyAndEnable = forge
  .mutation()
  .description('Verify and activate two-factor authentication')
  .input({
    body: z.object({
      otp: z.string()
    })
  })
  .callback(
    async ({
      pb,
      body: { otp },
      req: {
        headers: { authorization }
      }
    }) => {
      const userId = pb.instance.authStore.record?.id

      if (!userId) {
        throw new ClientError('User not authenticated', 401)
      }

      if (!authorization) {
        throw new ClientError('Authorization header required', 401)
      }

      const userState = twoFAStates.get(userId)
      if (!userState?.tempCode || !userState.tempCodeExpiresAt) {
        throw new ClientError(
          'Authenticator setup expired. Please start over.',
          400
        )
      }

      if (dayjs().isAfter(dayjs(userState.tempCodeExpiresAt))) {
        twoFAStates.delete(userId)
        throw new ClientError(
          'Authenticator setup expired. Please start over.',
          400
        )
      }

      const challenge = generateChallenge()
      const decryptedOTP = decrypt2(
        decrypt2(otp, authorization.replace('Bearer ', '')),
        challenge
      )

      const verified = speakeasy.totp.verify({
        secret: userState.tempCode,
        encoding: 'base32',
        token: decryptedOTP
      })

      if (!verified) {
        throw new ClientError('Invalid OTP', 401)
      }

      const masterKey = process.env.MASTER_KEY
      if (!masterKey) {
        throw new ClientError('Server configuration error', 500)
      }

      await pb.update
        .collection('users')
        .id(userId)
        .data({
          twoFASecret: encrypt(
            Buffer.from(userState.tempCode),
            masterKey
          ).toString('base64')
        })
        .execute()

      // Clean up state after successful enable
      twoFAStates.delete(userId)
    }
  )

export const disable = forge
  .mutation()
  .description('Disable two-factor authentication')
  .input({})
  .callback(async ({ pb }) => {
    const userId = pb.instance.authStore.record?.id

    if (!userId) {
      throw new ClientError('User not authenticated', 401)
    }

    const userState = twoFAStates.get(userId)

    if (!userState?.canDisable) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please validate your OTP first.',
        403
      )
    }

    if (dayjs().isAfter(dayjs(userState.expiresAt))) {
      twoFAStates.delete(userId)
      throw new ClientError(
        '2FA disable window has expired. Please validate your OTP again.',
        403
      )
    }

    await pb.update
      .collection('users')
      .id(userId)
      .data({
        twoFASecret: ''
      })
      .execute()

    twoFAStates.delete(userId)
  })

export const verify = forge
  .mutation()
  .noAuth()
  .description('Verify two-factor authentication code')
  .input({
    body: z.object({
      otp: z.string(),
      tid: z.string(),
      type: z.enum(['email', 'app'])
    })
  })
  .callback(async ({ body: { otp, tid, type } }) => {
    const pbHost = process.env.PB_HOST
    if (!pbHost) {
      throw new ClientError('Server configuration error', 500)
    }

    const pb = new PocketBase(pbHost)

    if (tid !== currentSession.tokenId) {
      throw new ClientError('Invalid token ID', 401)
    }

    if (dayjs().isAfter(dayjs(currentSession.tokenExpireAt))) {
      throw new ClientError('Token expired', 401)
    }

    const currentSessionToken = currentSession.token

    if (!currentSessionToken) {
      throw new ClientError('No session token found', 401)
    }

    pb.authStore.save(currentSessionToken, null)
    await pb
      .collection('users')
      .authRefresh()
      .catch(error => {
        throw new ClientError(
          `Session validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          401
        )
      })

    if (!pb.authStore.isValid || !pb.authStore.record) {
      throw new ClientError('Invalid session', 401)
    }

    let verified = false

    if (type === 'app') {
      verified = await verifyAppOTP(pb, otp)
    } else if (type === 'email') {
      verified = await verifyEmailOTP(pb, otp)
    }

    if (!verified) {
      throw new ClientError('Invalid OTP', 401)
    }

    const userData = pb.authStore.record

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb)

    return {
      session: pb.authStore.token
    }
  })
