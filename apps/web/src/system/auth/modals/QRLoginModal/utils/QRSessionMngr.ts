const QR_SESSION_STORAGE_KEY = 'lifeforge-qr-login-session'

/**
 * Get stored QR session from sessionStorage
 */
function getStoredSession(): {
  sessionId: string
  qrData: string
  expiresAt: string
} | null {
  try {
    const stored = sessionStorage.getItem(QR_SESSION_STORAGE_KEY)

    if (!stored) return null

    const session = JSON.parse(stored)

    // Check if session is still valid (not expired)
    const now = Date.now()

    const expiry = new Date(session.expiresAt).getTime()

    if (expiry <= now) {
      sessionStorage.removeItem(QR_SESSION_STORAGE_KEY)

      return null
    }

    return session
  } catch {
    return null
  }
}

/**
 * Store QR session in sessionStorage
 */
function storeSession(session: {
  sessionId: string
  qrData: string
  expiresAt: string
}): void {
  sessionStorage.setItem(QR_SESSION_STORAGE_KEY, JSON.stringify(session))
}

/**
 * Clear stored QR session
 */
function clearStoredSession(): void {
  sessionStorage.removeItem(QR_SESSION_STORAGE_KEY)
}

export { getStoredSession, storeSession, clearStoredSession }
