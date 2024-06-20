/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/member-delimiter-style */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AUTH_ERROR_MESSAGES } from '../constants/auth'

interface IAuthData {
  auth: boolean
  setAuth: React.Dispatch<React.SetStateAction<boolean>>
  authenticate: ({
    email,
    password
  }: {
    email: string
    password: string
  }) => Promise<string>
  verifyToken: (token: string) => Promise<{ success: boolean; userData: any }>
  logout: () => void
  loginQuota: {
    quota: number
    dismissQuota: () => void
  }
  authLoading: boolean
  userData: any
  setUserData: React.Dispatch<React.SetStateAction<any>>
  getAvatarURL: () => string
}

const AuthContext = createContext<IAuthData | undefined>(undefined)

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [auth, setAuth] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [quota, setQuota] = useState(5)
  const [authLoading, setAuthLoading] = useState(true)

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

  async function verifyToken(token: string): Promise<{
    success: boolean
    userData: any
  }> {
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
  }

  async function authenticate({
    email,
    password
  }: {
    email: string
    password: string
  }): Promise<string> {
    const res = fetch(`${import.meta.env.VITE_API_HOST}/user/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          window.localStorage.setItem('quota', '5')
          window.localStorage.removeItem('lastQuotaExceeded')

          document.cookie = `token=${data.token}; path=/; expires=${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString()}`

          setUserData(data.userData)
          setAuth(true)

          return 'success: ' + data.userData.name
        } else {
          switch (data.message) {
            case 'Invalid credentials':
              return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS
            default:
              return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
          }
        }
      })
      .catch(err => {
        if (err) {
          return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        } else {
          return AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
        }
      })

    return await res
  }

  function logout(): void {
    setAuth(false)
    document.cookie = `token=; path=/; expires=${new Date(0).toUTCString()}`
    setUserData(null)

    window.localStorage.setItem('quota', '5')
    window.localStorage.removeItem('lastQuotaExceeded')
  }

  useEffect(() => {
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

  function getAvatarURL(): string {
    if (userData) {
      return `${import.meta.env.VITE_API_HOST}/media/${userData.collectionId}/${
        userData.id
      }/${userData.avatar}?thumb=256x0`
    }
    return ''
  }

  return (
    <AuthContext
      value={{
        auth,
        setAuth,
        authenticate,
        verifyToken,
        logout,
        loginQuota: {
          quota,
          dismissQuota
        },
        authLoading,
        userData,
        setUserData,
        getAvatarURL
      }}
    >
      {children}
    </AuthContext>
  )
}

export function useAuthContext(): IAuthData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
