import { decrypt2, encrypt, encrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import { z } from 'zod/v4'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'
import { verifyAppOTP, verifyEmailOTP } from '../utils/otp'

export let canDisable2FA = false

export let challenge = v4()

setTimeout(
  () => {
    challenge = v4()
  },
  1000 * 60 * 5
)

let tempCode = ''

const getChallenge = forgeController.query

  .description('Get 2FA challenge')
  .input({})
  .callback(async () => challenge)

const requestOTP = forgeController.query

  .description('Request OTP for 2FA')
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
    currentSession.tokenExpireAt = moment().add(5, 'minutes').toISOString()

    return currentSession.tokenId
  })

const validateOTP = forgeController.mutation

  .description('Validate OTP for 2FA')
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

const generateAuthenticatorLink = forgeController.query

  .description('Generate authenticator link for 2FA')
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
        issuer: 'Lifeforge.'
      }).base32

      return encrypt2(
        encrypt2(
          `otpauth://totp/${email}?secret=${tempCode}&issuer=Lifeforge.`,
          challenge
        ),
        authorization!.replace('Bearer ', '')
      )
    }
  )

const verifyAndEnable2FA = forgeController.mutation

  .description('Verify and enable 2FA')
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
        .collection('users__users')
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

const disable2FA = forgeController.mutation

  .description('Disable 2FA')
  .input({})
  .callback(async ({ pb }) => {
    if (!canDisable2FA) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please try again later.',
        403
      )
    }

    await pb.update
      .collection('users__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        twoFASecret: ''
      })
      .execute()

    canDisable2FA = false
  })

const verify2FA = forgeController.mutation
  .description('Verify 2FA code')
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

    if (moment().isAfter(moment(currentSession.tokenExpireAt))) {
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

    removeSensitiveData(userData)

    await updateNullData(userData, pb)

    return {
      session: pb.authStore.token,
      userData
    }
  })

export default forgeRouter({
  getChallenge,
  requestOTP,
  validateOTP,
  generateAuthenticatorLink,
  verifyAndEnable2FA,
  disable2FA,
  verify2FA
})
