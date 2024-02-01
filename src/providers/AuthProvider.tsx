/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { GlobalStateContext } from './GlobalStateProvider'
import { AUTH_ERROR_MESSAGES } from '../constants/auth'
import { toast } from 'react-toastify'

const AUTH_DATA: {
  auth: boolean
  authenticate: ({
    email,
    password
  }: {
    email: string
    password: string
  }) => Promise<string>
  authWithOauth: (provider: string) => Promise<string>
  logout: () => void
  loginQuota: {
    quota: number
    dismissQuota: () => void
  }
  authLoading: boolean
  userData: any
  getAvatarURL: () => string
} = {
  auth: false,
  authenticate: async () => '',
  authWithOauth: async () => '',
  logout: () => {},
  loginQuota: {
    quota: 5,
    dismissQuota: () => {}
  },
  authLoading: true,
  userData: null,
  getAvatarURL: () => ''
}

export const AuthContext = createContext(AUTH_DATA)

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const [auth, setAuth] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [quota, setQuota] = useState(5)
  const [authLoading, setAuthLoading] = useState(true)
  const {
    pocketbase: { pocketbase, loading, error }
  } = useContext(GlobalStateContext)

  function updateQuota(): number {
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
  }

  function dismissQuota(): void {
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
  }

  async function authenticate({
    email,
    password
  }: {
    email: string
    password: string
  }): Promise<string> {
    if (!loading && pocketbase !== null && error === null) {
      try {
        await pocketbase
          .collection('users')
          .authWithPassword(email, password)
          .catch(e => {
            throw e.message
          })

        window.localStorage.setItem('quota', '5')
        window.localStorage.removeItem('lastQuotaExceeded')

        document.cookie = `token=${
          pocketbase.authStore.token
        }; path=/; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`

        setUserData(pocketbase.authStore.model)

        return 'success: ' + pocketbase.authStore.model?.name
      } catch (error) {
        switch (error) {
          case 'Failed to authenticate.':
            return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
          default:
            return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        }
      } finally {
        setAuth(pocketbase.authStore.isValid)
      }
    } else {
      return AUTH_ERROR_MESSAGES.DATABASE_NOT_READY
    }
  }

  async function authWithOauth(provider: string): Promise<string> {
    if (!loading && pocketbase !== null && error === null) {
      try {
        const w = window.open()

        await pocketbase
          .collection('users')
          .authWithOAuth2({
            provider,
            urlCallback: url => {
              w.location.href = url
            }
          })
          .catch(e => {
            throw e.message
          })

        window.localStorage.setItem('quota', '5')
        window.localStorage.removeItem('lastQuotaExceeded')

        document.cookie = `token=${
          pocketbase.authStore.token
        }; path=/; expires=${new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString()}`

        setUserData(pocketbase.authStore.model)

        return 'success: ' + pocketbase.authStore.model?.name
      } catch (error) {
        switch (error) {
          case 'Failed to authenticate.':
            return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
          default:
            return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        }
      } finally {
        setAuth(pocketbase.authStore.isValid)
      }
    } else {
      return AUTH_ERROR_MESSAGES.DATABASE_NOT_READY
    }
  }

  function logout(): void {
    console.log(pocketbase)
    if (!loading && pocketbase !== null) {
      pocketbase.authStore.clear()
      console.log('sus')
      setAuth(false)
      document.cookie = `token=; path=/; expires=${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toUTCString()}`
      setUserData(null)

      window.localStorage.setItem('quota', '5')
      window.localStorage.removeItem('lastQuotaExceeded')
    }
  }

  useEffect(() => {
    setAuthLoading(true)
    if (!loading && pocketbase !== null && document.cookie.includes('token')) {
      ;(async () => {
        await pocketbase.collection('users').authRefresh()
        setAuth(pocketbase.authStore.isValid)
        setUserData(pocketbase.authStore.model)
      })()
        .catch(() => {
          setAuth(false)
        })
        .finally(() => {
          setAuthLoading(false)
        })
    } else {
      setAuthLoading(false)
    }
  }, [loading])

  useEffect(() => {
    updateQuota()
  }, [])

  function getAvatarURL(): string {
    const _userData = pocketbase?.authStore.model
    if (_userData) {
      return `${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
        _userData.collectionId
      }/${_userData.id}/${_userData.avatar}`
    }
    return ''
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        authenticate,
        authWithOauth,
        logout,
        loginQuota: {
          quota,
          dismissQuota
        },
        authLoading,
        userData,
        getAvatarURL
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
