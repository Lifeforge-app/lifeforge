import forgeAPI from '@/utils/forgeAPI'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getBrowserInfo, useAPIEndpoint, useAuth } from 'shared'
import { Socket, io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

import {
  clearStoredSession,
  getStoredSession,
  storeSession
} from '../utils/QRSessionMngr'

export type QRStatus =
  | 'loading'
  | 'ready'
  | 'waiting'
  | 'approved'
  | 'expired'
  | 'error'

interface UseQRLoginSessionOptions {
  onSuccess: () => void
}

export default function useQRLoginSession({
  onSuccess
}: UseQRLoginSessionOptions) {
  const { t } = useTranslation('common.auth')

  const apiHost = useAPIEndpoint()

  const { verifySession, setAuth, setUserData } = useAuth()

  const [status, setStatus] = useState<QRStatus>('loading')

  const [qrData, setQrData] = useState<string>('')

  const [expiresAt, setExpiresAt] = useState<string>('')

  const [timeLeft, setTimeLeft] = useState<number>(0)

  const sessionIdRef = useRef<string>('')

  const socketRef = useRef<Socket | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Fallback polling for WebSocket connection issues
   */
  const startPolling = useCallback(
    (sessionId: string) => {
      if (pollingIntervalRef.current) return

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await forgeAPI.user.qrLogin.checkQRSessionStatus
            .input({
              sessionId
            })
            .query()

          if (response.status === 'approved' && response.session) {
            clearInterval(pollingIntervalRef.current!)
            pollingIntervalRef.current = null
            clearStoredSession()

            setStatus('approved')
            localStorage.setItem('session', response.session)

            const { success, userData } = await verifySession(response.session)

            if (success && userData) {
              setUserData(userData)
              setAuth(true)
              toast.success(
                t('messages.welcomeBack', {
                  name: userData.username || userData.name
                })
              )
              onSuccess()
            }
          } else if (response.status === 'expired') {
            clearInterval(pollingIntervalRef.current!)
            pollingIntervalRef.current = null
            clearStoredSession()
            setStatus('expired')
          }
        } catch {
          // Ignore polling errors
        }
      }, 3000)
    },
    [verifySession, setAuth, setUserData, t, onSuccess]
  )

  /**
   * Connect to WebSocket for a given session ID
   */
  const connectWebSocket = useCallback(
    (sessionId: string) => {
      // Clean up existing socket connection
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      // Connect to WebSocket for real-time updates
      const socket = io(`${apiHost}/qr-login`, {
        transports: ['websocket', 'polling']
      })

      socketRef.current = socket

      socket.on('connect', () => {
        socket.emit('joinQRSession', sessionId)
      })

      socket.on('joinedQRSession', () => {
        // Successfully joined the session room
      })

      socket.on('sessionApproved', async (data: { session: string }) => {
        setStatus('approved')
        clearStoredSession()

        // Store the session token
        localStorage.setItem('session', data.session)

        // Verify the session and complete login
        const { success, userData } = await verifySession(data.session)

        if (success && userData) {
          setUserData(userData)
          setAuth(true)
          toast.success(
            t('messages.welcomeBack', {
              name: userData.username || userData.name
            })
          )
          onSuccess()
        } else {
          setStatus('error')
          toast.error(t('messages.unknownError'))
        }
      })

      socket.on('error', () => {
        // Socket error, fall back to polling
        startPolling(sessionId)
      })

      socket.on('disconnect', () => {
        // If disconnected, start polling as fallback
        if (status !== 'approved' && status !== 'expired') {
          startPolling(sessionId)
        }
      })
    },
    [
      apiHost,
      verifySession,
      setAuth,
      setUserData,
      t,
      onSuccess,
      status,
      startPolling
    ]
  )

  /**
   * Initialize QR session - check for existing session first
   */
  const initializeSession = useCallback(
    async (forceNew = false) => {
      setStatus('loading')

      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      // Check for existing valid session
      if (!forceNew) {
        const storedSession = getStoredSession()

        if (storedSession) {
          sessionIdRef.current = storedSession.sessionId
          setQrData(storedSession.qrData)
          setExpiresAt(storedSession.expiresAt)
          setStatus('ready')

          // Connect WebSocket for existing session
          connectWebSocket(storedSession.sessionId)

          return
        }
      }

      try {
        // Generate new session ID
        const sessionId = uuidv4()

        sessionIdRef.current = sessionId

        // Register the QR session with the server
        const response = await forgeAPI.user.qrLogin.registerQRSession.mutate({
          sessionId,
          browserInfo: getBrowserInfo()
        })

        const newExpiresAt = response.expiresAt

        setExpiresAt(newExpiresAt)

        // Create QR data (simple, just sessionId for mobile to identify)
        const qrSessionData = {
          type: 'lifeforge-qr-login',
          v: 1,
          sessionId
        }

        const qrDataString = JSON.stringify(qrSessionData)

        setQrData(qrDataString)
        setStatus('ready')

        // Store session for persistence
        storeSession({
          sessionId,
          qrData: qrDataString,
          expiresAt: newExpiresAt
        })

        // Connect WebSocket
        connectWebSocket(sessionId)
      } catch (error) {
        console.error('Failed to initialize QR session:', error)
        setStatus('error')
        toast.error(t('messages.unknownError'))
      }
    },
    [t, connectWebSocket]
  )

  /**
   * Force create a new session (for refresh button)
   */
  const refreshSession = useCallback(() => {
    clearStoredSession()
    initializeSession(true)
  }, [initializeSession])

  /**
   * Update countdown timer
   */
  useEffect(() => {
    if (!expiresAt || status === 'approved' || status === 'expired') return

    const updateTimer = () => {
      const now = Date.now()

      const expiry = new Date(expiresAt).getTime()

      const remaining = Math.max(0, Math.floor((expiry - now) / 1000))

      setTimeLeft(remaining)

      if (remaining === 0) {
        setStatus('expired')
        clearStoredSession()
      }
    }

    updateTimer()

    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, status])

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeSession()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  return {
    status,
    qrData,
    timeLeft,
    refreshSession
  }
}
