import z from 'zod'

import forge from '../forge'
import { findToken, revokeFamily } from '../utils/refreshTokenStore'

const COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/auth',
  maxAge: 0
}

export const logout = forge
  .mutation({
    description: 'Invalidate refresh token and clear session',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.boolean(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ req, res, response }) => {
    const refreshToken = req.cookies?.refresh_token as string | undefined

    if (!refreshToken) {
      return response.unauthorized()
    }

    const record = await findToken(refreshToken)

    if (!record) {
      res.cookie('refresh_token', '', COOKIE_CLEAR_OPTIONS)

      return response.unauthorized()
    }

    await revokeFamily(record.family)

    res.cookie('refresh_token', '', COOKIE_CLEAR_OPTIONS)

    return response.ok(true)
  })
