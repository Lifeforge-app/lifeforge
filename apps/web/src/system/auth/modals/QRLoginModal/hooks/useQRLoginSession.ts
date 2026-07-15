import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Socket, io } from 'socket.io-client'

import { setAccessToken, useAuth } from '@lifeforge/api'
import { toast } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import {
  clearStoredSession,
  getStoredSession,
  storeSession
} from '../utils/QRSessionMngr'
import getBrowserInfo from '../utils/getBrowserInfo'

export type QRStatus =
  'loading' | 'ready' | 'waiting' | 'approved' | 'expired' | 'error'

interface UseQRLoginSessionOptions {
  onSuccess: () => void
}

export default function useQRLoginSession({
  onSuccess
}: UseQRLoginSessionOptions) {
  const { t } = useTranslation('common.auth')
  const { setAuth, setUserData } = useAuth()
  const [status, setStatus] = useState<QRStatus>('loading')
  const [qrData, setQrData] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const sessionIdRef = useRef<string>('')
  const socketRef = useRef<Socket | null>(null)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleApproved = useCallback(
    async (accessToken: string) => {
      setStatus('approved')
      clearStoredSession()

      setAccessToken(accessToken)

      try {
        const meData = await forgeAPI.auth.me.queryRaw()

        setUserData(meData.userData)
        setAuth(true)
        toast.success(
          t('messages.welcomeBack', {
            name: meData.userData.name
          })
        )
        onSuccess()
      } catch {
        setStatus('error')
        toast.error(t('messages.unknownError'))
      }
    },
    [setAuth, setUserData, t, onSuccess]
  )

  const startPolling = useCallback(
    (sessionId: string) => {
      if (pollingIntervalRef.current) return

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await forgeAPI.auth.qrLogin.status
            .input({ sessionId })
            .queryRaw()

          if (response.status === 'approved') {
            clearInterval(pollingIntervalRef.current!)
            pollingIntervalRef.current = null

            await forgeAPI.auth.qrLogin.claim.mutateRaw({ sessionId })

            await handleApproved(response.accessToken)
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
    [handleApproved]
  )

  const connectWebSocket = useCallback(
    (sessionId: string) => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      const apiHost = import.meta.env.VITE_API_HOST || window.location.origin
      const socket = io(`${apiHost}/qr-login`, {
        transports: ['websocket', 'polling']
      })

      socketRef.current = socket

      socket.on('connect', () => {
        socket.emit('joinQRSession', sessionId)
      })

      socket.on('sessionApproved', async (data: { accessToken: string }) => {
        await forgeAPI.auth.qrLogin.claim.mutateRaw({ sessionId })
        await handleApproved(data.accessToken)
      })

      socket.on('error', () => {
        startPolling(sessionId)
      })

      socket.on('disconnect', () => {
        if (status !== 'approved' && status !== 'expired') {
          startPolling(sessionId)
        }
      })
    },
    [handleApproved, startPolling, status]
  )

  const initializeSession = useCallback(
    async (forceNew = false) => {
      setStatus('loading')

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }

      if (!forceNew) {
        const storedSession = getStoredSession()

        if (storedSession) {
          sessionIdRef.current = storedSession.sessionId
          setQrData(storedSession.qrData)
          setExpiresAt(storedSession.expiresAt)
          setStatus('ready')
          connectWebSocket(storedSession.sessionId)

          return
        }
      }

      try {
        const response = await forgeAPI.auth.qrLogin.register.mutateRaw({
          browserInfo: getBrowserInfo()
        })

        const sessionId = response.sessionId

        sessionIdRef.current = sessionId
        setExpiresAt(response.expiresAt)

        const qrSessionData = {
          type: 'lifeforge-qr-login',
          v: 1,
          sessionId
        }

        const qrDataString = JSON.stringify(qrSessionData)

        setQrData(qrDataString)
        setStatus('ready')

        storeSession({
          sessionId,
          qrData: qrDataString,
          expiresAt: response.expiresAt
        })

        connectWebSocket(sessionId)
      } catch {
        setStatus('error')
        toast.error(t('messages.unknownError'))
      }
    },
    [t, connectWebSocket]
  )

  const refreshSession = useCallback(() => {
    clearStoredSession()
    initializeSession(true)
  }, [initializeSession])

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
