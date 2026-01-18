import { ClientError } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

import { decrypt2, encrypt, encrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'
import { verifyAppOTP, verifyEmailOTP } from '../utils/otp'
import forge from '../forge'

let canDisable2FA = false
let challenge = v4()

setTimeout(
  () => {
    challenge = v4()
  },
  1000 * 60 * 5
)

let tempCode = ''

export const getChallenge = forge
  .query()
  .description('Retrieve 2FA challenge token')
  .input({})
  .callback(async () => challenge)

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
      .requestOTP(email as string)
      .catch(() => null)

    if (!otp) {
      throw new Error('Failed to request OTP')
    }

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
    if (await _validateOTP(pb, body, challenge)) {
      canDisable2FA = true
      setTimeout(
        () => {
          canDisable2FA = false
        },
        1000 * 60 * 5
      )

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
      const { email } = pb.instance.authStore.record!

      tempCode = speakeasy.generateSecret({
        name: email,
        length: 32,
        issuer: 'LifeForge.'
      }).base32

      return encrypt2(
        encrypt2(
          `otpauth://totp/${email}?secret=${tempCode}&issuer=LifeForge.`,
          challenge
        ),
        authorization!.replace('Bearer ', '')
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
      const decryptedOTP = decrypt2(
        decrypt2(otp, authorization!.replace('Bearer ', '')),
        challenge
      )

      const verified = speakeasy.totp.verify({
        secret: tempCode,
        encoding: 'base32',
        token: decryptedOTP
      })

      if (!verified) {
        throw new ClientError('Invalid OTP', 401)
      }

      await pb.update
        .collection('users')
        .id(pb.instance.authStore.record!.id)
        .data({
          twoFASecret: encrypt(
            Buffer.from(tempCode),
            process.env.MASTER_KEY!
          ).toString('base64')
        })
        .execute()
    }
  )

export const disable = forge
  .mutation()
  .description('Disable two-factor authentication')
  .input({})
  .callback(async ({ pb }) => {
    if (!canDisable2FA) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please try again later.',
        403
      )
    }

    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data({
        twoFASecret: ''
      })
      .execute()

    canDisable2FA = false
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
    const pb = new PocketBase(process.env.PB_HOST)

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
      .catch(() => {})

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
