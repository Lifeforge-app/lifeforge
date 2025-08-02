import { Icon } from '@iconify/react/dist/iconify.js'
import { LoadingScreen, ModalManager } from 'lifeforge-ui'
import { Suspense, useEffect, useState } from 'react'
import { usePersonalization } from 'shared'

import MainContent from './pages/MainContent'
import LocaleManagerProvider from './providers/LocaleManagerProvider'
import forgeAPI from './utils/forgeAPI'

const LocaleAdmin = () => {
  const [isAuthed, setIsAuthed] = useState<'loading' | boolean>('loading')

  const { setFontFamily, setTheme, setRawThemeColor, setBgTemp, setLanguage } =
    usePersonalization()

  const failAuth = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setIsAuthed(false)
  }

  const verifyToken = async () => {
    try {
      const { userData } = await forgeAPI.user.auth.verifySessionToken.mutate(
        {}
      )

      setIsAuthed(true)

      setFontFamily(userData.fontFamily || 'Inter')
      setTheme(userData.theme || 'system')
      setRawThemeColor(
        userData.color
          ? userData.color.startsWith('#')
            ? userData.color
            : `theme-${userData.color}`
          : 'theme-lime'
      )
      setBgTemp(
        userData.bgTemp
          ? userData.bgTemp.startsWith('#')
            ? userData.bgTemp
            : `bg-${userData.bgTemp}`
          : 'bg-zinc'
      )
      setLanguage(userData.language || 'en')
    } catch {
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
    <main
      className="bg-bg-200/50 flex-center text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex min-h-dvh w-full flex-col p-12"
      id="app"
    >
      <Suspense fallback={<LoadingScreen />}>
        {(() => {
          if (isAuthed === 'loading') {
            return <LoadingScreen />
          }

          if (isAuthed === false) {
            return (
              <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
                <Icon className="mb-4 text-9xl" icon="tabler:lock-access" />
                <h2 className="text-4xl">Unauthorized Personnel</h2>
                <p className="text-bg-500 mt-4 text-center text-lg">
                  Please authenticate through single sign-on (SSO) in the system
                  to access the locale editor.
                </p>
                <a
                  className="bg-custom-500 text-bg-800 hover:bg-custom-400 mt-16 flex items-center justify-center gap-2 rounded-md p-4 px-6 font-semibold tracking-widest uppercase transition-all"
                  href={import.meta.env.VITE_FRONTEND_URL}
                >
                  <Icon className="text-2xl" icon="tabler:hammer" />
                  Go to System
                </a>
              </div>
            )
          }

          return (
            <LocaleManagerProvider>
              <MainContent />
            </LocaleManagerProvider>
          )
        })()}
      </Suspense>
      <ModalManager />
    </main>
  )
}

export default LocaleAdmin
