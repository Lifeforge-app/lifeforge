import moment from 'moment'
import PocketBase from 'pocketbase'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

import { removeSensitiveData, updateNullData } from '../utils/auth'

// In-memory storage for pending QR login sessions
// In production, consider using Redis for multi-instance support
interface PendingQRSession {
  sessionId: string
  browserInfo: string
  createdAt: string
  expiresAt: string
  userId?: string // Set when approved
  sessionToken?: string // Set when approved
  status: 'pending' | 'approved' | 'expired'
}

const pendingQRSessions = new Map<string, PendingQRSession>()

// Cleanup expired sessions every minute
setInterval(() => {
  const now = moment()

  for (const [sessionId, session] of pendingQRSessions) {
    if (moment(session.expiresAt).isBefore(now)) {
      pendingQRSessions.delete(sessionId)
    }
  }
}, 60 * 1000)

/**
 * Register a new QR login session.
 * Called by the unauthenticated desktop client.
 * Data is already encrypted by forgeAPI layer.
 */
const registerQRSession = forgeController
  .mutation()
  .noAuth()
  .description({
    en: 'Register a new QR login session',
    ms: 'Daftarkan sesi log masuk QR baharu',
    'zh-CN': '注册新的二维码登录会话',
    'zh-TW': '註冊新的二維碼登入會話'
  })
  .input({
    body: z.object({
      sessionId: z.string().uuid(),
      browserInfo: z.string()
    })
  })
  .callback(async ({ body: { sessionId, browserInfo } }) => {
    // Check if session ID already exists
    if (pendingQRSessions.has(sessionId)) {
      throw new ClientError('Session already registered', 400)
    }

    // Create the pending session with 5-minute expiration
    const session: PendingQRSession = {
      sessionId,
      browserInfo,
      createdAt: moment().toISOString(),
      expiresAt: moment().add(5, 'minutes').toISOString(),
      status: 'pending'
    }

    pendingQRSessions.set(sessionId, session)

    return {
      sessionId,
      expiresAt: session.expiresAt
    }
  })

/**
 * Approve a QR login session from an authenticated mobile device.
 */
const approveQRLogin = forgeController
  .mutation()
  .description({
    en: 'Approve a QR login request',
    ms: 'Luluskan permintaan log masuk QR',
    'zh-CN': '批准二维码登录请求',
    'zh-TW': '批准二維碼登入請求'
  })
  .input({
    body: z.object({
      sessionId: z.string().uuid()
    })
  })
  .callback(async ({ pb, body: { sessionId }, req }) => {
    // Find the pending session
    const pendingSession = pendingQRSessions.get(sessionId)

    if (!pendingSession) {
      throw new ClientError('Session not found or expired', 404)
    }

    // Check if already approved
    if (pendingSession.status === 'approved') {
      throw new ClientError('Session already approved', 400)
    }

    // Check if expired
    if (moment(pendingSession.expiresAt).isBefore(moment())) {
      pendingQRSessions.delete(sessionId)
      throw new ClientError('Session expired', 400)
    }

    // Get the approving user's data
    const userData = pb.instance.authStore.record

    if (!userData) {
      throw new ClientError('User not found', 404)
    }

    // Create a new session for the desktop client
    // We need to refresh to get a fresh token
    const newPb = new PocketBase(process.env.PB_HOST)

    newPb.authStore.save(pb.instance.authStore.token, userData)
    await newPb.collection('users').authRefresh()

    const newSessionToken = newPb.authStore.token

    // Update the pending session
    pendingSession.status = 'approved'
    pendingSession.userId = userData.id
    pendingSession.sessionToken = newSessionToken

    // Update user data if needed
    const sanitizedUserData = removeSensitiveData(userData)

    await updateNullData(sanitizedUserData, pb.instance)

    // Emit the session to the WebSocket room
    const io = req.io

    if (io) {
      const qrLoginNamespace = io.of('/qr-login')

      qrLoginNamespace.to(`qr-session:${sessionId}`).emit('sessionApproved', {
        session: newSessionToken,
        user: sanitizedUserData
      })
    }

    return {
      success: true,
      browserInfo: pendingSession.browserInfo
    }
  })

/**
 * Check the status of a QR login session.
 * Fallback for WebSocket connection issues.
 */
const checkQRSessionStatus = forgeController
  .query()
  .noAuth()
  .description({
    en: 'Check QR login session status',
    ms: 'Semak status sesi log masuk QR',
    'zh-CN': '检查二维码登录会话状态',
    'zh-TW': '檢查二維碼登入會話狀態'
  })
  .input({
    query: z.object({
      sessionId: z.string().uuid()
    })
  })
  .callback(async ({ query: { sessionId } }) => {
    const pendingSession = pendingQRSessions.get(sessionId)

    if (!pendingSession) {
      return { status: 'not_found' as const }
    }

    // Check if expired
    if (moment(pendingSession.expiresAt).isBefore(moment())) {
      pendingQRSessions.delete(sessionId)

      return { status: 'expired' as const }
    }

    if (pendingSession.status === 'approved' && pendingSession.sessionToken) {
      // Return the session token and clean up
      const result = {
        status: 'approved' as const,
        session: pendingSession.sessionToken
      }

      // Clean up after returning the session
      pendingQRSessions.delete(sessionId)

      return result
    }

    return {
      status: pendingSession.status as 'pending',
      expiresAt: pendingSession.expiresAt
    }
  })

export default forgeRouter({
  registerQRSession,
  approveQRLogin,
  checkQRSessionStatus
})
