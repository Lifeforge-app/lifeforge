import dayjs from 'dayjs'
import PocketBase from 'pocketbase'
import z from 'zod'

import forge from '../forge'
import { removeSensitiveData, updateNullData } from '../utils/auth'

interface PendingQRSession {
  sessionId: string
  browserInfo: string
  createdAt: string
  expiresAt: string
  userId?: string
  sessionToken?: string
  status: 'pending' | 'approved' | 'expired'
}

const pendingQRSessions = new Map<string, PendingQRSession>()

setInterval(() => {
  const now = dayjs()

  for (const [sessionId, session] of pendingQRSessions) {
    if (dayjs(session.expiresAt).isBefore(now)) {
      pendingQRSessions.delete(sessionId)
    }
  }
}, 60 * 1000)

export const registerQRSession = forge
  .mutation({
    description: 'Register a new QR login session',
    noAuth: true,
    input: {
      body: z.object({
        sessionId: z.string().uuid(),
        browserInfo: z.string()
      })
    },
    output: {
      CREATED: z.object({
        sessionId: z.string(),
        expiresAt: z.string()
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ body: { sessionId, browserInfo }, response }) => {
    if (pendingQRSessions.has(sessionId)) {
      return response.badRequest('Session already registered')
    }

    const session: PendingQRSession = {
      sessionId,
      browserInfo,
      createdAt: dayjs().toISOString(),
      expiresAt: dayjs().add(5, 'minutes').toISOString(),
      status: 'pending'
    }

    pendingQRSessions.set(sessionId, session)

    return response.created({
      sessionId,
      expiresAt: session.expiresAt
    })
  })

export const approveQRLogin = forge
  .mutation({
    description: 'Approve a QR login request',
    input: {
      body: z.object({
        sessionId: z.string().uuid()
      })
    },
    output: {
      OK: z.object({
        success: z.boolean(),
        browserInfo: z.string()
      }),
      NOT_FOUND: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body: { sessionId }, req, response }) => {
    const pendingSession = pendingQRSessions.get(sessionId)

    if (!pendingSession) {
      return response.notFound()
    }

    if (pendingSession.status === 'approved') {
      return response.badRequest('Session already approved')
    }

    if (dayjs(pendingSession.expiresAt).isBefore(dayjs())) {
      pendingQRSessions.delete(sessionId)

      return response.badRequest('Session expired')
    }

    const userData = pb.instance.authStore.record

    if (!userData) {
      return response.notFound()
    }

    const newPb = new PocketBase(process.env.PB_HOST)

    newPb.authStore.save(pb.instance.authStore.token, userData)
    await newPb.collection('users').authRefresh()

    const newSessionToken = newPb.authStore.token

    pendingSession.status = 'approved'
    pendingSession.userId = userData.id
    pendingSession.sessionToken = newSessionToken

    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb.instance)

    const io = req.io

    if (io) {
      const qrLoginNamespace = io.of('/qr-login')

      qrLoginNamespace.to(`qr-session:${sessionId}`).emit('sessionApproved', {
        session: newSessionToken,
        user: sanitizedUserData
      })
    }

    return response.ok({
      success: true,
      browserInfo: pendingSession.browserInfo
    })
  })

export const checkQRSessionStatus = forge
  .query({
    description: 'Check QR login session status',
    noAuth: true,
    input: {
      query: z.object({
        sessionId: z.string().uuid()
      })
    },
    output: {
      OK: z.union([
        z.object({ status: z.literal('not_found') }),
        z.object({ status: z.literal('expired') }),
        z.object({
          status: z.literal('approved'),
          session: z.string()
        }),
        z.object({
          status: z.literal('pending'),
          expiresAt: z.string()
        })
      ])
    }
  })
  .callback(async ({ query: { sessionId }, response }) => {
    const pendingSession = pendingQRSessions.get(sessionId)

    if (!pendingSession) {
      return response.ok({ status: 'not_found' as const })
    }

    if (dayjs(pendingSession.expiresAt).isBefore(dayjs())) {
      pendingQRSessions.delete(sessionId)

      return response.ok({ status: 'expired' as const })
    }

    if (pendingSession.status === 'approved' && pendingSession.sessionToken) {
      const result = {
        status: 'approved' as const,
        session: pendingSession.sessionToken
      }

      pendingQRSessions.delete(sessionId)

      return response.ok(result)
    }

    return response.ok({
      status: pendingSession.status as 'pending',
      expiresAt: pendingSession.expiresAt
    })
  })
