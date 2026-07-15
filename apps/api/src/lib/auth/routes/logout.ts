import z from 'zod'

import { getClearCookieOptions } from '../constants/cookie'
import forge from '../forge'
import { findToken, revokeFamily } from '../utils/refreshTokenStore'

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
      res.cookie('refresh_token', '', getClearCookieOptions(req))

      return response.unauthorized()
    }

    await revokeFamily(record.family)

    res.cookie('refresh_token', '', getClearCookieOptions(req))

    return response.ok(true)
  })
