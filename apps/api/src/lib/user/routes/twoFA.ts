import { decrypt2, encrypt, encrypt2 } from '@functions/auth/encryption'
import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

import { currentSession } from '..'
import forge from '../forge'
import { removeSensitiveData, updateNullData } from '../utils/auth'
import { verifyAppOTP, verifyEmailOTP } from '../utils/otp'

let challenge = v4()

setTimeout(
  () => {
    challenge = v4()
  },
  1000 * 60 * 5
)

let tempCode = ''

export const getChallenge = forge
  .query({
    description: 'Retrieve 2FA challenge token',
    input: {},
    output: {
      OK: z.string()
    }
  })
  .callback(async ({ response }) => response.ok(challenge))

export const requestOTP = forge
  .query({
    description: 'Request OTP for two-factor authentication',
    noAuth: true,
    input: {
      query: z.object({
        email: z.string().email()
      })
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, query: { email }, response }) => {
    const otp = await pb.instance
      .collection('users')
      .requestOTP(email)
      .catch(() => null)

    if (!otp) {
      return response.badRequest('Failed to request OTP')
    }

    currentSession.tokenId = v4()
    currentSession.otpId = otp.otpId
    currentSession.tokenExpireAt = dayjs().add(5, 'minutes').toISOString()

    return response.ok(currentSession.tokenId)
  })

export const generateAuthenticatorLink = forge
  .query({
    description: 'Generate authenticator app setup link',
    input: {},
    output: {
      OK: z.string()
    }
  })
  .callback(
    async ({
      pb,
      req: {
        headers: { authorization }
      },
      response
    }) => {
      const { email } = pb.instance.authStore.record!

      tempCode = speakeasy.generateSecret({
        name: email,
        length: 32,
        issuer: 'LifeForge.'
      }).base32

      return response.ok(
        encrypt2(
          encrypt2(
            `otpauth://totp/${email}?secret=${tempCode}&issuer=LifeForge.`,
            challenge
          ),
          authorization!.replace('Bearer ', '')
        )
      )
    }
  )

export const verifyAndEnable = forge
  .mutation({
    description: 'Verify and activate two-factor authentication',
    input: {
      body: z.object({
        otp: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(
    async ({
      pb,
      body: { otp },
      req: {
        headers: { authorization }
      },
      response
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
        return response.unauthorized()
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

      return response.noContent()
    }
  )

export const disable = forge
  .mutation({
    description: 'Disable two-factor authentication',
    input: {},
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ pb, response }) => {
    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data({
        twoFASecret: ''
      })
      .execute()

    return response.noContent()
  })

export const verify = forge
  .mutation({
    description: 'Verify two-factor authentication code',
    noAuth: true,
    input: {
      body: z.object({
        otp: z.string(),
        tid: z.string(),
        type: z.enum(['email', 'app'])
      })
    },
    output: {
      OK: z.object({
        session: z.string()
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { otp, tid, type }, response }) => {
    const pb = new PocketBase(process.env.PB_HOST)

    if (tid !== currentSession.tokenId) {
      return response.unauthorized()
    }

    if (dayjs().isAfter(dayjs(currentSession.tokenExpireAt))) {
      return response.unauthorized()
    }

    const currentSessionToken = currentSession.token

    if (!currentSessionToken) {
      return response.unauthorized()
    }

    pb.authStore.save(currentSessionToken, null)
    await pb
      .collection('users')
      .authRefresh()
      .catch(() => {})

    if (!pb.authStore.isValid || !pb.authStore.record) {
      return response.unauthorized()
    }

    let verified = false

    if (type === 'app') {
      verified = await verifyAppOTP(pb, otp)
    } else if (type === 'email') {
      verified = await verifyEmailOTP(pb, otp)
    }

    if (!verified) {
      return response.unauthorized()
    }

    const userData = pb.authStore.record

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb)

    return response.ok({
      session: pb.authStore.token
    })
  })
