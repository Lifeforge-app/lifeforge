import { decrypt, encrypt } from '@functions/auth/encryption'
import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@lifeforge/pocketbase'
import speakeasy from 'speakeasy'
import { v4 } from 'uuid'
import z from 'zod'

import { getCookieOptions } from '../constants/cookie'
import { getPB } from '../constants/pb'
import forge from '../forge'
import {
  pending2FASessions,
  pendingTOTPSetups
} from '../utils/2fa'
import { storeRefreshToken } from '../utils/refreshTokenStore'
import {
  generateFamily,
  generateRefreshToken,
  signAccessToken
} from '../utils/tokens'

const MASTER_KEY = process.env.MASTER_KEY!

export const generate = forge
  .mutation({
    description: 'Generate 2FA authenticator app setup link',
    encrypted: false,
    input: {},
    output: {
      OK: z.object({
        tid: z.string(),
        link: z.string()
      })
    }
  })
  .callback(async ({ response }) => {
    const pb = await getPB('user')
    const user = await pb.getFirstListItem.collection('users').execute()

    const secret = speakeasy.generateSecret({
      name: user.email,
      length: 32,
      issuer: 'LifeForge.'
    }).base32

    const tid = v4()

    pendingTOTPSetups.set(tid, { secret })

    const otpauthUrl = `otpauth://totp/${encodeURIComponent(user.email)}?secret=${secret}&issuer=LifeForge.`

    return response.ok({
      tid,
      link: otpauthUrl
    })
  })

export const enable = forge
  .mutation({
    description: 'Verify OTP and enable two-factor authentication',
    encrypted: false,
    input: {
      body: z.object({
        otp: z.string(),
        tid: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { otp, tid }, response }) => {
    const pending = pendingTOTPSetups.get(tid)

    if (!pending) {
      return response.unauthorized()
    }

    pendingTOTPSetups.del(tid)

    const verified = speakeasy.totp.verify({
      secret: pending.secret,
      encoding: 'base32',
      token: otp
    })

    if (!verified) {
      return response.unauthorized()
    }

    const pb = await getPB('user')
    const user = await pb.getFirstListItem.collection('users').execute()

    await pb.update
      .collection('users')
      .id(user.id)
      .data({
        twoFASecret: encrypt(Buffer.from(pending.secret), MASTER_KEY).toString(
          'base64'
        )
      })
      .execute()

    return response.noContent()
  })

export const disable = forge
  .mutation({
    description: 'Disable two-factor authentication',
    encrypted: false,
    input: {},
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ response }) => {
    const pb = await getPB('user')
    const user = await pb.getFirstListItem.collection('users').execute()

    await pb.update
      .collection('users')
      .id(user.id)
      .data({ twoFASecret: '' })
      .execute()

    return response.noContent()
  })

export const verify = forge
  .mutation({
    description: 'Verify two-factor authentication code during login',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        otp: z.string(),
        tid: z.string()
      })
    },
    output: {
      OK: z.object({
        accessToken: z.string()
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { otp, tid }, req, res, response }) => {
    const pending = pending2FASessions.get(tid)

    if (!pending) {
      return response.unauthorized()
    }

    pending2FASessions.del(tid)

    const config = validateEnvironmentVariables()
    const pb = await connectToPocketBase(config)
    const user = await pb.collection('users').getOne(pending.userId)
    const encryptedSecret = user.twoFASecret as string | undefined

    if (!encryptedSecret) {
      return response.unauthorized()
    }

    const secret = decrypt(
      Buffer.from(encryptedSecret, 'base64'),
      MASTER_KEY
    ).toString('utf-8')

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp
    })

    if (!verified) {
      return response.unauthorized()
    }

    const userId = pending.userId
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1'

    const accessToken = signAccessToken(userId)
    const refreshToken = generateRefreshToken()
    const family = generateFamily()

    await storeRefreshToken({
      token: refreshToken,
      family,
      ip
    })

    res.cookie('refresh_token', refreshToken, getCookieOptions(req))

    return response.ok({ accessToken })
  })
