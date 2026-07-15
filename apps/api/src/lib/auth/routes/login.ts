import { verify as argonVerify } from 'argon2'
import z from 'zod'

import { COOKIE_OPTIONS } from '../constants/cookie'
import { getPB } from '../constants/pb'
import forge from '../forge'
import {
  checkLoginRateLimit,
  clearLoginRateLimit,
  recordFailedLogin
} from '../utils/loginRateLimiter'
import { storeRefreshToken } from '../utils/refreshTokenStore'
import {
  generateFamily,
  generateRefreshToken,
  signAccessToken
} from '../utils/tokens'

export const login = forge
  .mutation({
    description: 'Authenticate user with email and password',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        email: z.email(),
        password: z.string().min(1)
      })
    },
    output: {
      OK: z.object({
        accessToken: z.string()
      }),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { email, password }, req, res, response }) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1'

    if (!checkLoginRateLimit(ip)) {
      return response.unauthorized()
    }

    const pb = await getPB('user')

    const users = await pb.getFullList
      .collection('users')
      .filter([
        {
          field: 'email',
          operator: '=',
          value: email
        }
      ])
      .execute()

    if (users.length === 0) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    const user = users[0]

    const passwordHash = user.auth_password_hash

    if (!passwordHash) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    const valid = await argonVerify(passwordHash, password)

    if (!valid) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    clearLoginRateLimit(ip)

    const accessToken = signAccessToken(user.id)
    const refreshToken = generateRefreshToken()
    const family = generateFamily()

    await storeRefreshToken({
      token: refreshToken,
      family,
      ip
    })

    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS)

    return response.ok({ accessToken })
  })
