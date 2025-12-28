import moment from 'moment'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

import {
  decrypt,
  decrypt2,
  encrypt,
  encrypt2
} from '@functions/auth/encryption'
import { signToken } from '@functions/auth/jwt'
import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

import { currentSession } from '..'
import { removeSensitiveData, updateNullData } from '../utils/auth'

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
      req: {
        jwtPayload,
        headers: { authorization }
      }
    }) => {
      if (!jwtPayload) {
        throw new ClientError('User not authenticated', 401)
      }

      tempCode = speakeasy.generateSecret({
        name: jwtPayload.email,
        length: 32,
        issuer: 'LifeForge.'
      }).base32

      return encrypt2(
        encrypt2(
          `otpauth://totp/${jwtPayload.email}?secret=${tempCode}&issuer=LifeForge.`,
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
        jwtPayload,
        headers: { authorization }
      }
    }) => {
      if (!jwtPayload) {
        throw new ClientError('User not authenticated', 401)
      }

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
        .id(jwtPayload.userId)
        .data({
          twoFASecret: encrypt(
            Buffer.from(tempCode),
            process.env.MASTER_KEY!
          ).toString('base64')
        })
        .execute()
    }
  )

const verifyForDisable = forgeController
  .mutation()
  .description({
    en: 'Verify OTP to allow disabling 2FA',
    ms: 'Sahkan OTP untuk melumpuhkan 2FA',
    'zh-CN': '验证OTP以禁用2FA',
    'zh-TW': '驗證OTP以禁用2FA'
  })
  .input({
    body: z.object({
      otp: z.string()
    })
  })
  .callback(async ({ req: { jwtPayload }, body: { otp } }) => {
    if (!jwtPayload) {
      throw new ClientError('User not authenticated', 401)
    }

    const config = validateEnvironmentVariables()

    const superPB = await connectToPocketBase(config)

    const userData = await superPB.collection('users').getOne(jwtPayload.userId)

    const encryptedSecret = userData.twoFASecret

    if (!encryptedSecret) {
      throw new ClientError('2FA not enabled', 400)
    }

    const secret = decrypt(
      Buffer.from(encryptedSecret, 'base64'),
      process.env.MASTER_KEY!
    )

    const verified = speakeasy.totp.verify({
      secret: secret.toString(),
      encoding: 'base32',
      token: otp
    })

    if (!verified) {
      throw new ClientError('Invalid OTP', 401)
    }

    canDisable2FA = true
    setTimeout(
      () => {
        canDisable2FA = false
      },
      1000 * 60 * 5
    )

    return true
  })

const disable = forgeController
  .mutation()
  .description({
    en: 'Disable two-factor authentication',
    ms: 'Lumpuhkan pengesahan dua faktor',
    'zh-CN': '禁用二次验证',
    'zh-TW': '禁用二次驗證'
  })
  .input({})
  .callback(async ({ pb, req: { jwtPayload } }) => {
    if (!jwtPayload) {
      throw new ClientError('User not authenticated', 401)
    }

    if (!canDisable2FA) {
      throw new ClientError(
        'You cannot disable 2FA right now. Please verify your OTP first.',
        403
      )
    }

    await pb.update
      .collection('user__users')
      .id(jwtPayload.userId)
      .data({
        twoFASecret: ''
      })
      .execute()

    canDisable2FA = false
  })

const verify = forgeController
  .mutation()
  .noAuth()
  .description({
    en: 'Verify two-factor authentication code during login',
    ms: 'Sahkan kod pengesahan dua faktor semasa log masuk',
    'zh-CN': '登录时验证二次验证代码',
    'zh-TW': '登入時驗證二次驗證代碼'
  })
  .input({
    body: z.object({
      otp: z.string(),
      tid: z.string()
    })
  })
  .callback(async ({ body: { otp, tid } }) => {
    if (tid !== currentSession.tokenId) {
      throw new ClientError('Invalid token ID', 401)
    }

    if (moment().isAfter(moment(currentSession.tokenExpireAt))) {
      throw new ClientError('Token expired', 401)
    }

    if (!currentSession.userId) {
      throw new ClientError('No user session found', 401)
    }

    const config = validateEnvironmentVariables()

    const superPB = await connectToPocketBase(config)

    const userData = await superPB
      .collection('users')
      .getOne(currentSession.userId)

    if (!userData) {
      throw new ClientError('User not found', 404)
    }

    const encryptedSecret = userData.twoFASecret

    if (!encryptedSecret) {
      throw new ClientError('2FA not configured', 400)
    }

    const secret = decrypt(
      Buffer.from(encryptedSecret, 'base64'),
      process.env.MASTER_KEY!
    )

    const verified = speakeasy.totp.verify({
      secret: secret.toString(),
      encoding: 'base32',
      token: otp
    })

    if (!verified) {
      throw new ClientError('Invalid OTP', 401)
    }

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, superPB)

    const jwtToken = signToken({
      userId: userData.id,
      email: userData.email,
      username: userData.username
    })

    currentSession.token = ''
    currentSession.tokenId = ''
    currentSession.tokenExpireAt = ''
    currentSession.userId = ''

    return {
      session: jwtToken
    }
  })

export default forgeRouter({
  getChallenge,
  generateAuthenticatorLink,
  verifyAndEnable,
  verifyForDisable,
  disable,
  verify
})
