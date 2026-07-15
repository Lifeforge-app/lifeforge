import z from 'zod'

import forge from '../forge'
import { verifyPassword } from '../utils/password'
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
import { connectToPocketBase, validateEnvironmentVariables } from '@functions/database/dbUtils'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000
}

export const login = forge
  .mutation({
    description: 'Authenticate user with email and password',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        email: z.string().email(),
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

    const config = validateEnvironmentVariables()
    const pb = await connectToPocketBase(config)

    const users = await pb
      .collection('users')
      .getFullList({ filter: `email = "${email}"` })

    if (users.length === 0) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    const user = users[0] as Record<string, unknown>

    const passwordHash = user.auth_password_hash as string | undefined

    if (!passwordHash) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    const valid = await verifyPassword(passwordHash, password)

    if (!valid) {
      recordFailedLogin(ip)

      return response.unauthorized()
    }

    clearLoginRateLimit(ip)

    const userId = user.id as string

    const accessToken = signAccessToken(userId)
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
