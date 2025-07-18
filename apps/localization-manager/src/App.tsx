/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react/dist/iconify.js'
import { LoadingScreen, ModalManager } from 'lifeforge-ui'
import React, { Suspense, useEffect, useState } from 'react'
import { APIEndpointProvider } from 'shared/lib'

import './i18n'
import MainContent from './pages/MainContent'
import LifeforgeUIProviderWrapper from './providers/LifeforgeUIProviderWrapper'
import PersonalizationProvider from './providers/PersonalizationProvider'

const LocaleAdmin = (): React.ReactElement => {
  const [isAuthed, setIsAuthed] = useState<'loading' | boolean>('loading')
  const [themeConfig, setThemeConfig] = useState<{
    fontFamily: string
    theme: 'light' | 'dark' | 'system'
    rawThemeColor: string
    bgTemp: string
    language: string
  }>({
    fontFamily: 'Inter',
    theme: 'system',
    rawThemeColor: 'theme-lime',
    bgTemp: 'bg-zinc',
    language: 'en'
  })

  const failAuth = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setIsAuthed(false)
  }

  const verifyToken = async () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )

    if (!token) {
      failAuth()
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/user/auth/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      failAuth()
    }

    const data = await res.json()

    if (data.state === 'success') {
      setIsAuthed(true)
      const { userData } = data.data

      setThemeConfig({
        fontFamily: userData.fontFamily || 'Inter',
        theme: userData.theme || 'system',
        rawThemeColor:
          (userData.color.startsWith('#')
            ? userData.color
            : `theme-${userData.color}`) || 'theme-blue',
        bgTemp:
          (userData.bgTemp.startsWith('#')
            ? userData.bgTemp
            : `bg-${userData.bgTemp}`) || 'bg-zinc',
        language: userData.language || 'en'
      })
    } else {
      failAuth()
    }
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('token')) {
      document.cookie = `token=${new URLSearchParams(
        window.location.search
      ).get('token')}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}`

      window.location.replace(window.location.origin)
    }

    if (document.cookie.includes('token')) {
      verifyToken()
    } else {
      failAuth()
    }
  }, [])

  return (
    <APIEndpointProvider endpoint={import.meta.env.VITE_API_URL}>
      <PersonalizationProvider
        isAuthed={isAuthed === true}
        config={themeConfig}
      >
        <LifeforgeUIProviderWrapper>
          <main
            id="app"
            className="bg-bg-200/50 flex-center text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex min-h-dvh w-full flex-col p-12"
          >
            <Suspense fallback={<LoadingScreen />}>
              {(() => {
                if (isAuthed === 'loading') {
                  return <LoadingScreen />
                }

                if (isAuthed === false) {
                  return (
                    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
                      <Icon
                        icon="tabler:lock-access"
                        className="mb-4 text-9xl"
                      />
                      <h2 className="text-4xl">Unauthorized Personnel</h2>
                      <p className="text-bg-500 mt-4 text-center text-lg">
                        Please authenticate through single sign-on (SSO) in the
                        system to access the locale editor.
                      </p>
                      <a
                        href={import.meta.env.VITE_FRONTEND_URL}
                        className="bg-custom-500 text-bg-900 hover:bg-custom-400 mt-16 flex items-center justify-center gap-2 rounded-md p-4 px-6 font-semibold tracking-widest uppercase transition-all"
                      >
                        <Icon icon="tabler:hammer" className="text-2xl" />
                        Go to System
                      </a>
                    </div>
                  )
                }

                return <MainContent />
              })()}
            </Suspense>
            <ModalManager />
          </main>
        </LifeforgeUIProviderWrapper>
      </PersonalizationProvider>
    </APIEndpointProvider>
  )
}

export default LocaleAdmin
