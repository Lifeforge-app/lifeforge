import { v4 } from 'uuid'
import z from 'zod'

import { getCookieOptions } from '../constants/cookie'
import { getPB } from '../constants/pb'
import forge from '../forge'
import { sessions } from '../utils/qrLogin'
import { storeRefreshToken } from '../utils/refreshTokenStore'
import {
  generateFamily,
  generateRefreshToken,
  signAccessToken
} from '../utils/tokens'


export const register = forge
  .mutation({
    description: 'Register a new QR login session',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        browserInfo: z.string()
      })
    },
    output: {
      CREATED: z.object({
        sessionId: z.string(),
        expiresAt: z.string()
      })
    }
  })
  .callback(async ({ body: { browserInfo }, response }) => {
    const sessionId = v4()

    sessions.set(sessionId, {
      sessionId,
      browserInfo,
      status: 'pending',
      accessToken: '',
      refreshToken: '',
      userId: ''
    })

    return response.created({
      sessionId,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ).toISOString()
    })
  })

export const approve = forge
  .mutation({
    description: 'Approve a QR login request from an authenticated device',
    encrypted: false,
    input: {
      body: z.object({
        sessionId: z.string().uuid()
      })
    },
    output: {
      OK: z.object({
        browserInfo: z.string()
      }),
      NOT_FOUND: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ body: { sessionId }, req, response }) => {
    const session = sessions.get(sessionId)

    if (!session) {
      return response.notFound()
    }

    if (session.status === 'approved') {
      return response.badRequest('Session already approved')
    }

    const pb = await getPB('user')
    const user = await pb.getFirstListItem.collection('users').execute()

    const accessToken = signAccessToken(user.id)
    const refreshToken = generateRefreshToken()
    const family = generateFamily()
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1'

    await storeRefreshToken({
      token: refreshToken,
      family,
      ip
    })

    session.status = 'approved'
    session.userId = user.id
    session.accessToken = accessToken
    session.refreshToken = refreshToken

    const io = req.io

    if (io) {
      io.of('/qr-login')
        .to(`qr-session:${sessionId}`)
        .emit('sessionApproved', { accessToken })
    }

    return response.ok({
      browserInfo: session.browserInfo
    })
  })

export const status = forge
  .query({
    description: 'Check QR login session status',
    noAuth: true,
    encrypted: false,
    input: {
      query: z.object({
        sessionId: z.string().uuid()
      })
    },
    output: {
      OK: z.union([
        z.object({
          status: z.literal('pending'),
          expiresAt: z.string()
        }),
        z.object({
          status: z.literal('approved'),
          accessToken: z.string()
        }),
        z.object({
          status: z.literal('expired')
        }),
        z.object({
          status: z.literal('not_found')
        })
      ])
    }
  })
  .callback(async ({ query: { sessionId }, response }) => {
    const session = sessions.get(sessionId)

    if (!session) {
      return response.ok({ status: 'not_found' as const })
    }

    if (session.status === 'approved') {
      const { accessToken } = session

      sessions.del(sessionId)

      return response.ok({
        status: 'approved' as const,
        accessToken
      })
    }

    return response.ok({
      status: 'pending' as const,
      expiresAt: new Date(sessions.expiryTime(sessionId)!).toISOString()
    })
  })

export const claim = forge
  .mutation({
    description: 'Claim approved QR login session and set auth cookie',
    noAuth: true,
    encrypted: false,
    input: {
      body: z.object({
        sessionId: z.string().uuid()
      })
    },
    output: {
      OK: z.object({
        accessToken: z.string()
      }),
      NOT_FOUND: true
    }
  })
  .callback(async ({ body: { sessionId }, req, res, response }) => {
    const session = sessions.get(sessionId)

    if (!session || session.status !== 'approved') {
      return response.notFound()
    }

    res.cookie('refresh_token', session.refreshToken, getCookieOptions(req))

    const { accessToken } = session

    sessions.del(sessionId)

    return response.ok({ accessToken })
  })
