import z from 'zod'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@lifeforge/pocketbase'

import { getCookieOptions } from '../constants/cookie'
import forge from '../forge'
import {
  findToken,
  revokeFamily,
  rotateToken
} from '../utils/refreshTokenStore'
import { generateRefreshToken, signAccessToken } from '../utils/tokens'

async function getFirstUserId(): Promise<string> {
  const config = validateEnvironmentVariables()
  const pb = await connectToPocketBase(config)
  const users = await pb.collection('users').getFullList({ fields: 'id' })

  return users[0]?.id || ''
}

export const refresh = forge
  .mutation({
    description: 'Refresh access token using refresh token cookie',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.object({
        accessToken: z.string()
      }),
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
      return response.unauthorized()
    }

    if (record.revoked) {
      await revokeFamily(record.family)

      return response.unauthorized()
    }

    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1'

    if (record.bound_ip !== ip) {
      await revokeFamily(record.family)

      return response.unauthorized()
    }

    const now = Date.now()

    if (new Date(record.expires_at).getTime() < now) {
      return response.unauthorized()
    }

    const userId = await getFirstUserId()

    const accessToken = signAccessToken(userId)
    const newRefreshToken = generateRefreshToken()

    await rotateToken({
      oldTokenHash: record.token_hash,
      newToken: newRefreshToken,
      ip,
      family: record.family
    })

    res.cookie('refresh_token', newRefreshToken, getCookieOptions(req))

    return response.ok({ accessToken })
  })
