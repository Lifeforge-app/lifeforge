import dayjs from 'dayjs'

interface PendingQRSession {
  sessionId: string
  browserInfo: string
  createdAt: number
  expiresAt: number
  status: 'pending' | 'approved'
  accessToken: string
  refreshToken: string
  userId: string
}

const QR_SESSION_TTL_MINUTES = 5

const sessions = new Map<string, PendingQRSession>()

setInterval(() => {
  const now = dayjs()

  for (const [id, session] of sessions) {
    if (dayjs(session.expiresAt).isBefore(now)) {
      sessions.delete(id)
    }
  }
}, 60_000)

export function createQRSession(sessionId: string, browserInfo: string): void {
  sessions.set(sessionId, {
    sessionId,
    browserInfo,
    createdAt: Date.now(),
    expiresAt: dayjs().add(QR_SESSION_TTL_MINUTES, 'minutes').valueOf(),
    status: 'pending',
    accessToken: '',
    refreshToken: '',
    userId: ''
  })
}

export function getQRSession(
  sessionId: string
): PendingQRSession | undefined {
  const session = sessions.get(sessionId)

  if (session && dayjs(session.expiresAt).isBefore(dayjs())) {
    sessions.delete(sessionId)

    return undefined
  }

  return session
}

export function approveQRSession(
  sessionId: string,
  userId: string,
  accessToken: string,
  refreshToken: string
): PendingQRSession | null {
  const session = sessions.get(sessionId)

  if (!session || session.status !== 'pending') return null

  session.status = 'approved'
  session.userId = userId
  session.accessToken = accessToken
  session.refreshToken = refreshToken

  return session
}

export function deleteQRSession(sessionId: string): void {
  sessions.delete(sessionId)
}
