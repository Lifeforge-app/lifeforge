import {
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

type UserData = {
  [key: string]: any
}

interface AuthData {
  auth: boolean
  setAuth: (value: boolean) => void
  authenticate: ({
    email,
    password
  }: {
    email: string
    password: string
  }) => Promise<string | void>
  authenticateWith2FA: ({
    otp
  }: {
    otp: string
    type: 'email' | 'app'
  }) => Promise<string | void>
  verifySession: (
    session: string
  ) => Promise<{ success: boolean; userData: UserData | null }>
  verifyOAuth: (code: string, state: string) => Promise<boolean>
  logout: () => void
  authLoading: boolean
  userData: UserData | null
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
  getAvatarURL: () => string
  tid: RefObject<string>
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export default function AuthProvider({
  forgeAPI,
  onTwoFAModalOpen,
  children
}: {
  forgeAPI: any
  onTwoFAModalOpen: () => void
  children: React.ReactNode
}) {
  const { t } = useTranslation('common.auth')

  const [auth, _setAuth] = useState(false)

  const [userData, setUserData] = useState<UserData | null>(null)

  const [authLoading, setAuthLoading] = useState(true)

  const tid = useRef('')

  const setAuth = useCallback(
    (value: boolean) => {
      _setAuth(value)
    },
    [_setAuth]
  )

  const verifySession = useCallback(
    async (
      session: string
    ): Promise<{
      success: boolean
      userData: UserData | null
    }> => {
      return await fetch(forgeAPI.user.auth.verifySessionToken.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
        .then(async res => {
          const data = await res.json()

          if (res.ok && (data as any).state === 'success') {
            return { success: true, userData: (data as any).data.userData }
          } else {
            return { success: false, userData: null }
          }
        })
        .catch(() => {
          return { success: false, userData: null }
        })
    },
    []
  )

  const authenticate = useCallback(
    async ({
      email,
      password
    }: {
      email: string
      password: string
    }): Promise<string | void> => {
      try {
        const data = await forgeAPI.user.auth.login.mutate({
          email,
          password
        })

        if (data.state === 'success') {
          localStorage.setItem('session', data.session)

          setUserData(data.userData)
          setAuth(true)

          return 'success: ' + data.userData.name
        } else if (data.state === '2fa_required') {
          onTwoFAModalOpen()
          tid.current = data.tid

          return '2FA required'
        }
      } catch (err) {
        if (!(err instanceof Error)) {
          throw new Error('Unknown error')
        }

        if (err.message === 'Invalid credentials') {
          return 'invalid'
        }

        throw err
      }
    },
    []
  )

  const authenticateWith2FA = useCallback(
    async ({
      otp,
      type
    }: {
      otp: string
      type: 'email' | 'app'
    }): Promise<void> => {
      try {
        const res = await fetch(forgeAPI.user['2fa'].verify.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ otp, tid: tid.current, type })
        })

        const data: any = await res.json()

        if (res.ok && data.state === 'success') {
          localStorage.setItem('session', data.data.session)

          setUserData(data.data.userData)
          setAuth(true)

          return data.data.userData.name
        } else {
          throw new Error('Invalid OTP')
        }
      } catch {
        throw new Error('Invalid OTP')
      }
    },
    []
  )

  const verifyOAuth = useCallback(
    async (code: string, state: string): Promise<boolean> => {
      try {
        const storedState = localStorage.getItem('authState')

        const storedProvider = localStorage.getItem('authProvider')

        if (!state || !storedState || !storedProvider) {
          throw new Error('Invalid login attempt')
        }

        localStorage.removeItem('authProvider')
        localStorage.removeItem('authState')

        if (storedState !== state) {
          throw new Error('Invalid state')
        }

        const session = await forgeAPI.user.oauth.verify.mutate({
          code,
          provider: storedProvider
        })

        if (typeof session !== 'string') {
          if (session.state !== '2fa_required') {
            throw new Error('Invalid session')
          }
          onTwoFAModalOpen()
          tid.current = session.tid

          return true
        }

        const { success, userData } = await verifySession(session)

        if (success) {
          setUserData(userData)
          setAuth(true)

          localStorage.setItem('session', session)

          toast.success(t('auth.welcome') + userData?.username)

          return true
        } else {
          throw new Error('Invalid session')
        }
      } catch {
        setAuth(false)
        setUserData(null)
        setAuthLoading(false)
        toast.error(t('messages.invalidLoginAttempt'))

        return false
      } finally {
        setAuthLoading(false)
      }
    },
    [verifySession]
  )

  const logout = useCallback(() => {
    setAuth(false)
    localStorage.removeItem('session')
    setUserData(null)
  }, [])

  const getAvatarURL = useCallback((): string => {
    if (userData) {
      return forgeAPI.media.input({
        collectionId: userData.collectionId,
        recordId: userData.id,
        fieldId: userData.avatar,
        thumb: '256x0'
      }).endpoint
    }

    return ''
  }, [userData])

  const doUseEffect = useCallback(() => {
    setAuthLoading(true)

    if (localStorage.getItem('session')) {
      verifySession(localStorage.getItem('session')!)
        .then(async ({ success, userData }) => {
          if (success) {
            setUserData(userData)
            setAuth(true)
          }
        })
        .catch(() => {
          setAuth(false)
        })
        .finally(() => {
          setAuthLoading(false)
        })
    } else {
      setAuthLoading(false)
    }
  }, [])

  useEffect(() => {
    doUseEffect()
  }, [])

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      authenticate,
      authenticateWith2FA,
      verifySession,
      verifyOAuth,
      logout,
      authLoading,
      userData,
      setUserData,
      getAvatarURL,
      tid
    }),
    [auth, authLoading, userData, tid]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
