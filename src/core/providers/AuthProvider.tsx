import {
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

import fetchAPI from '@utils/fetchAPI'

import { AUTH_ERROR_MESSAGES } from '../auth/constants/auth'

interface IAuthData {
  auth: boolean
  setAuth: (value: boolean) => void
  authenticate: ({
    email,
    password
  }: {
    email: string
    password: string
  }) => Promise<string>
  authenticateWith2FA: ({ otp }: { otp: string }) => Promise<string | void>
  verifyToken: (token: string) => Promise<{ success: boolean; userData: any }>
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
  twoFAModalOpen: boolean
  setTwoFAModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthContext = createContext<IAuthData | undefined>(undefined)

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation('common.auth')
  const [auth, _setAuth] = useState(false)
  const [userData, _setUserData] = useState<any>(null)
  const [quota, setQuota] = useState(5)
  const [authLoading, setAuthLoading] = useState(true)
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false)
  const tid = useRef('')

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

    toast.error(AUTH_ERROR_MESSAGES.QUOTA_EXCEEDED)
  }, [updateQuota])

  const verifyToken = useCallback(
    async (
      token: string
    ): Promise<{
      success: boolean
      userData: any
    }> => {
      return await fetch(`${import.meta.env.VITE_API_HOST}/user/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(async res => {
          const data = await res.json()
          if (res.ok && data.state === 'success') {
            return { success: true, userData: data.userData }
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
    }): Promise<string> => {
      const res = fetch(`${import.meta.env.VITE_API_HOST}/user/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
        .then(async res => {
          const data = await res.json()

          if (res.ok) {
            if (data.state === 'success') {
              window.localStorage.setItem('quota', '5')
              window.localStorage.removeItem('lastQuotaExceeded')

              document.cookie = `token=${data.token}; path=/; expires=${new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toUTCString()}`

              setUserData(data.userData)
              setAuth(true)

              return 'success: ' + data.userData.name
            } else if (data.state === '2fa_required') {
              setTwoFAModalOpen(true)
              tid.current = data.tid
              return '2FA required'
            } else {
              return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
            }
          } else {
            if (data.message === 'Invalid credentials') {
              return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
            }

            return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
          }
        })
        .catch(() => {
          return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        })

      return await res
    },
    []
  )

  const authenticateWith2FA = useCallback(
    async ({ otp }: { otp: string }): Promise<void> => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_HOST}/user/2fa/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, tid: tid.current })
          }
        )

        const data = await res.json()

        if (res.ok && data.state === 'success') {
          window.localStorage.setItem('quota', '5')
          window.localStorage.removeItem('lastQuotaExceeded')

          document.cookie = `token=${data.token}; path=/; expires=${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString()}`

          setUserData(data.userData)
          setAuth(true)

          return data.userData.name
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

        const token = await fetchAPI<
          | string
          | {
              state: string
              tid: string
            }
        >('user/auth/oauth-verify', {
          method: 'POST',
          body: { code, provider: storedProvider }
        })

        if (typeof token !== 'string') {
          if (token.state !== '2fa_required') {
            throw new Error('Invalid login attempt')
          }
          setTwoFAModalOpen(true)
          tid.current = token.tid
          return
        }

        document.cookie = `token=${token}; path=/; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`

        verifyToken(token)
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
      } catch (err) {
        console.log(err)
        window.location.href = '/auth'
        toast.error('Invalid login attempt')
      }
    },
    [verifyToken]
  )

  const logout = useCallback(() => {
    setAuth(false)
    document.cookie = `token=; path=/; expires=${new Date(0).toUTCString()}`
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
    if (document.cookie.includes('token')) {
      verifyToken(document.cookie.split('=')[1])
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
      verifyToken,
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
      twoFAModalOpen,
      setTwoFAModalOpen
    }),
    [auth, quota, authLoading, userData, twoFAModalOpen]
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
