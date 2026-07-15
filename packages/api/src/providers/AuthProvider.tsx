/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { contract } from '../../contract'
import { createForgeProxy } from '../core'
import type { InferOutput } from '../typescript'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken
} from '../utils/authTokenStore'

let bootstrapped = false

const forgeAPI = createForgeProxy(contract)

export type UserData = InferOutput<typeof forgeAPI.auth.me>['userData']

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
  logout: () => void
  verifyOAuth: (code: string, state: string) => Promise<string | false>
  authenticateWith2FA: (otp: string) => Promise<string>
  authLoading: boolean
  userData: UserData | null
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
  getAvatarURL: () => string
  tid: RefObject<string>
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export function AuthProvider({
  onTwoFAModalOpen,
  children
}: {
  onTwoFAModalOpen: () => void
  children: React.ReactNode
}) {
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

  const authenticate = useCallback(
    async ({
      email,
      password
    }: {
      email: string
      password: string
    }): Promise<string | void> => {
      try {
        const loginData = await forgeAPI.auth.login.mutateRaw({
          email,
          password
        })

        if ('state' in loginData) {
          tid.current = loginData.tid
          onTwoFAModalOpen()

          return '2FA required'
        }

        setAccessToken(loginData.accessToken)

        const userResponse = await forgeAPI.auth.me.queryRaw()

        setUserData(userResponse.userData)
        setAuth(true)

        return 'success: ' + userResponse.userData.name
      } catch (err) {
        if (!(err instanceof Error)) {
          throw new Error('Unknown error')
        }

        if (
          err.message === 'Invalid authorization credentials' ||
          err.message === 'Failed to perform API request'
        ) {
          return 'invalid'
        }

        throw err
      }
    },
    [onTwoFAModalOpen]
  )

  const logout = useCallback(() => {
    clearAccessToken()
    setAuth(false)
    setUserData(null)

    forgeAPI.auth.logout.mutateRaw(undefined).catch(() => {})
  }, [])

  const verifyOAuth = useCallback(
    async (code: string, state: string): Promise<string | false> => {
      try {
        const storedState = sessionStorage.getItem('oauthState')
        const storedProvider = sessionStorage.getItem('oauthProvider')

        if (!state || !storedState || !storedProvider) {
          return false
        }

        sessionStorage.removeItem('oauthState')
        sessionStorage.removeItem('oauthProvider')

        if (storedState !== state) {
          return false
        }

        const oauthData = await forgeAPI.auth.oauth.verify.mutateRaw({
          code,
          provider: storedProvider,
          state
        })

        if ('state' in oauthData) {
          tid.current = oauthData.tid
          onTwoFAModalOpen()

          return '2FA required'
        }

        setAccessToken(oauthData.accessToken)

        const userResponse = await forgeAPI.auth.me.queryRaw()

        setUserData(userResponse.userData)
        setAuth(true)

        return 'success: ' + userResponse.userData.name
      } catch {
        setAuth(false)
        setUserData(null)

        return false
      } finally {
        setAuthLoading(false)
      }
    },
    [onTwoFAModalOpen]
  )

  const authenticateWith2FA = useCallback(
    async (otp: string): Promise<string> => {
      const data = await forgeAPI.auth['2fa'].verify.mutateRaw({
        otp,
        tid: tid.current
      })

      setAccessToken(data.accessToken)

      const userResponse = await forgeAPI.auth.me.queryRaw()

      setUserData(userResponse.userData)
      setAuth(true)

      return userResponse.userData.name
    },
    []
  )

  const getAvatarURL = useCallback((): string => {
    if (userData) {
      return (forgeAPI as any).getMedia({
        collectionId: userData.collectionId,
        recordId: userData.id,
        fieldId: userData.avatar,
        thumb: '256x0'
      })
    }

    return ''
  }, [userData, forgeAPI])

  useEffect(() => {
    if (getAccessToken()) {
      setAuth(true)
      setAuthLoading(false)

      return
    }

    if (bootstrapped) return

    bootstrapped = true
    setAuthLoading(true)

    forgeAPI.auth.refresh
      .mutateRaw(undefined)
      .then((data: { accessToken: string }) => {
        setAccessToken(data.accessToken)

        return forgeAPI.auth.me.queryRaw()
      })
      .then(data => {
        setUserData(data.userData)
        setAuth(true)
      })
      .catch(() => {
        setAuth(false)
        setUserData(null)
      })
      .finally(() => {
        setAuthLoading(false)
      })
  }, [])

  const value = useMemo(
    () => ({
      auth,
      setAuth,
      authenticate,
      logout,
      verifyOAuth,
      authenticateWith2FA,
      authLoading,
      userData,
      setUserData,
      getAvatarURL,
      tid
    }),
    [auth, authLoading, userData, setUserData, tid]
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
