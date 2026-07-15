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

import type { ProxyTree } from '../typescript'
import { clearAccessToken, getAccessToken, setAccessToken } from '../utils/authTokenStore'

let bootstrapped = false

export interface UserData {
  id: string
  collectionId: string
  collectionName: string
  email: string
  emailVisibility: boolean
  verified: boolean
  username: string
  name: string
  avatar: string
  dateOfBirth: string
  theme: string
  color: string
  bgTemp: string
  bgImage: string
  fontFamily: string
  fontScale: number
  borderRadiusMultiplier: number
  bordered: boolean
  language: string
  dashboardLayout: unknown | null
  hasAPIKeysMasterPassword: boolean
  twoFAEnabled: boolean
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
  logout: () => void
  authLoading: boolean
  userData: UserData | null
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
  getAvatarURL: () => string
  tid: RefObject<string>
}

export const AuthContext = createContext<AuthData | undefined>(undefined)

export function AuthProvider({
  forgeAPI,
  onTwoFAModalOpen,
  children
}: {
  forgeAPI: ProxyTree<any>
  onTwoFAModalOpen: () => void
  children: React.ReactNode
}) {
  const [auth, _setAuth] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const tid = useRef('')

  const _forgeAPI = forgeAPI as any

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
        const loginData = await _forgeAPI.auth.login.mutateRaw({
          email,
          password
        })

        setAccessToken(loginData.accessToken)

        const userResponse = await _forgeAPI.auth.me.queryRaw()

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
    []
  )

  const logout = useCallback(() => {
    clearAccessToken()
    setAuth(false)
    setUserData(null)

    _forgeAPI.auth.logout.mutateRaw().catch(() => {})
  }, [])

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

    _forgeAPI.auth.refresh
      .mutateRaw()
      .then((data: { accessToken: string }) => {
        setAccessToken(data.accessToken)

        return _forgeAPI.auth.me.queryRaw()
      })
      .then((data: { userData: UserData }) => {
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
