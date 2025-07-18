import TwoFAModal from '@core/pages/Auth/modals/TwoFAModal'
import { useModalStore } from 'lifeforge-ui'
import { cookieParse } from 'pocketbase'
import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

interface IAuthData {
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
  ) => Promise<{ success: boolean; userData: any }>
  verifyOAuth: (code: string, state: string) => void
  logout: () => void
  loginQuota: {
    quota: number
    dismissQuota: () => void
  }
  authLoading: boolean
  userData: any
  setUserData: React.Dispatch<React.SetStateAction<any>>
  getAvatarURL: () => string
  tid: RefObject<string>
}

export const AuthContext = createContext<IAuthData | undefined>(undefined)

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('common.auth')
  const [auth, _setAuth] = useState(false)
  const [userData, _setUserData] = useState<any>(null)
  const [quota, setQuota] = useState(5)
  const [authLoading, setAuthLoading] = useState(true)
  const navigate = useNavigate()
  const tid = useRef('')

  const handleTwoFAModalOpen = useCallback(() => {
    open(TwoFAModal, {})
  }, [])

  const setAuth = useCallback(
    (value: boolean) => {
      _setAuth(value)
    },
    [_setAuth]
  )

  const setUserData = useCallback(
    (data: any) => {
      _setUserData(data)
    },
    [_setUserData]
  )

  const updateQuota = useCallback((): number => {
    const storedQuota = window.localStorage.getItem('quota')
    if (storedQuota) {
      if (storedQuota !== '0') {
        setQuota(parseInt(storedQuota, 10))
        return parseInt(storedQuota, 10)
      }

      let lastQuotaExceeded: number | string | null =
        window.localStorage.getItem('lastQuotaExceeded')
      if (lastQuotaExceeded) {
        lastQuotaExceeded = parseInt(lastQuotaExceeded, 10)
        if (Date.now() - lastQuotaExceeded > 60 * 60 * 1000) {
          setQuota(5)
          window.localStorage.setItem('quota', '5')
          window.localStorage.removeItem('lastQuotaExceeded')
          return 5
        }
        return 0
      }
      return 0
    } else {
      setQuota(5)
      return 5
    }
  }, [])

  const dismissQuota = useCallback(() => {
    const _quota = updateQuota()

    if (_quota - 1 <= 0) {
      window.localStorage.setItem('lastQuotaExceeded', Date.now().toString())
    }

    if (_quota - 1 >= 0) {
      setQuota(_quota - 1)
      window.localStorage.setItem('quota', (_quota - 1).toString())
      return
    }

    toast.error(t('messages.quotaExceeded'))
  }, [updateQuota])

  const verifySession = useCallback(
    async (
      session: string
    ): Promise<{
      success: boolean
      userData: any
    }> => {
      return await fetch(`${import.meta.env.VITE_API_HOST}/user/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session}`
        }
      })
        .then(async res => {
          const data = await res.json()
          if (res.ok && data.state === 'success') {
            return { success: true, userData: data.data.userData }
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
      const res = fetch(`${import.meta.env.VITE_API_HOST}/user/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(async res => {
          if (!res.ok) {
            try {
              const data = await res.json()
              if (data.message) {
                if (data.message === 'Invalid credentials') {
                  return 'invalid'
                }

                throw new Error(data.message)
              }
            } catch {
              throw new Error('Unknown error')
            }
          }

          const { data } = await res.json()

          if (data.state === 'success') {
            window.localStorage.setItem('quota', '5')
            window.localStorage.removeItem('lastQuotaExceeded')

            document.cookie = `session=${data.session}; path=/; expires=${new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toUTCString()}`

            setUserData(data.userData)
            setAuth(true)

            return 'success: ' + data.userData.name
          } else if (data.state === '2fa_required') {
            handleTwoFAModalOpen()
            tid.current = data.tid
            return '2FA required'
          }
        })
        .catch(err => {
          toast.error(err)
        })

      return await res
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
        const res = await fetch(
          `${import.meta.env.VITE_API_HOST}/user/2fa/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, tid: tid.current, type })
          }
        )

        const data = await res.json()

        if (res.ok && data.state === 'success') {
          window.localStorage.setItem('quota', '5')
          window.localStorage.removeItem('lastQuotaExceeded')

          document.cookie = `session=${data.data.session}; path=/; expires=${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString()}`

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
    async (code: string, state: string) => {
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

        const session = await fetchAPI<
          | string
          | {
              state: string
              tid: string
            }
        >(import.meta.env.VITE_API_HOST, 'user/oauth/verify', {
          method: 'POST',
          body: { code, provider: storedProvider }
        })

        if (typeof session !== 'string') {
          if (session.state !== '2fa_required') {
            throw new Error()
          }
          handleTwoFAModalOpen()
          tid.current = session.tid
          return
        }

        document.cookie = `session=${session}; path=/; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`

        verifySession(session)
          .then(async ({ success, userData }) => {
            if (success) {
              setUserData(userData)
              setAuth(true)

              toast.success(t('auth.welcome') + userData.username)
            }
          })
          .catch(() => {
            setAuth(false)
          })
          .finally(() => {
            setAuthLoading(false)
          })
      } catch {
        navigate('/auth')
        toast.error(toast.error(t('messages.invalidLoginAttempt')))
      }
    },
    [verifySession]
  )

  const logout = useCallback(() => {
    setAuth(false)
    document.cookie = `session=; path=/; expires=${new Date(0).toUTCString()}`
    setUserData(null)

    window.localStorage.setItem('quota', '5')
    window.localStorage.removeItem('lastQuotaExceeded')
  }, [])

  const getAvatarURL = useCallback((): string => {
    if (userData) {
      return `${import.meta.env.VITE_API_HOST}/media/${userData.collectionId}/${
        userData.id
      }/${userData.avatar}?thumb=256x0`
    }
    return ''
  }, [userData])

  const doUseEffect = useCallback(() => {
    setAuthLoading(true)
    updateQuota()
    if (document.cookie.includes('session')) {
      verifySession(cookieParse(document.cookie).session)
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
      loginQuota: {
        quota,
        dismissQuota
      },
      authLoading,
      userData,
      setUserData,
      getAvatarURL,
      tid
    }),
    [auth, quota, authLoading, userData, tid]
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): IAuthData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
