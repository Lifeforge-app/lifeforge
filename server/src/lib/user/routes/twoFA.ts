import { decrypt2, encrypt, encrypt2 } from '@functions/auth/encryption'
import { default as _validateOTP } from '@functions/auth/validateOTP'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import PocketBase from 'pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

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

const getChallenge = forgeController
  .query()
  .description({
    en: 'Retrieve 2FA challenge token',
    ms: 'Dapatkan token cabaran 2FA',
    'zh-CN': '获取二次验证挑战令牌',
    'zh-TW': '獲取二次驗證挑戰令牌'
  })
  .input({})
  .callback(async () => challenge)

const requestOTP = forgeController
  .query()
  .noAuth()
  .description({
    en: 'Request OTP for two-factor authentication',
    ms: 'Minta OTP untuk pengesahan dua faktor',
    'zh-CN': '请求二次验证的OTP',
    'zh-TW': '請求二次驗證的OTP'
  })
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

const validateOTP = forgeController
  .mutation()
  .noAuth()
  .description({
    en: 'Verify OTP for two-factor authentication',
    ms: 'Sahkan OTP untuk pengesahan dua faktor',
    'zh-CN': '验证二次验证的OTP',
    'zh-TW': '驗證二次驗證的OTP'
  })
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

const generateAuthenticatorLink = forgeController
  .query()
  .description({
    en: 'Generate authenticator app setup link',
    ms: 'Jana pautan persediaan aplikasi pengesah',
    'zh-CN': '生成身份验证器设置链接',
    'zh-TW': '生成身份驗證器設置連結'
  })
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

const verifyAndEnable = forgeController
  .mutation()
  .description({
    en: 'Verify and activate two-factor authentication',
    ms: 'Sahkan dan aktifkan pengesahan dua faktor',
    'zh-CN': '验证并启用二次验证',
    'zh-TW': '驗證並啟用二次驗證'
  })
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
        .collection('user__users')
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

const disable = forgeController
  .mutation()
  .description({
    en: 'Disable two-factor authentication',
    ms: 'Lumpuhkan pengesahan dua faktor',
    'zh-CN': '禁用二次验证',
    'zh-TW': '禁用二次驗證'
  })
  .input({})
  .callback(async ({ pb }) => {
    if (!canDisable2FA) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please try again later.',
        403
      )
    }

    await pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        twoFASecret: ''
      })
      .execute()

    canDisable2FA = false
  })

const verify = forgeController
  .mutation()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Verify two-factor authentication code',
    ms: 'Sahkan kod pengesahan dua faktor',
    'zh-CN': '验证二次验证代码',
    'zh-TW': '驗證二次驗證代碼'
  })
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

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb)

    return {
      session: pb.authStore.token
    }
  })

export default forgeRouter({
  getChallenge,
  requestOTP,
  validateOTP,
  generateAuthenticatorLink,
  verifyAndEnable,
  disable,
  verify
})
