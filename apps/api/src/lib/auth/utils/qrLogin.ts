import { createCache } from '@functions/cache'

interface PendingQRSession {
  sessionId: string
  browserInfo: string
  status: 'pending' | 'approved'
  accessToken: string
  refreshToken: string
  userId: string
}

export const sessions = createCache<PendingQRSession>('qr-sessions-auth', { stdTTL: 300 })
