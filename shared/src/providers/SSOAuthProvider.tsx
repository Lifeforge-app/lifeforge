import React, { useEffect, useState } from 'react'

import { usePersonalization } from './PersonalizationProvider'

function SSOAuthProvider({
  forgeAPI,
  children
}: {
  forgeAPI: any
  children: (isAuthed: boolean | 'loading') => React.ReactNode
}) {
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
    if (new URLSearchParams(window.location.search).has('session')) {
      document.cookie = `session=${new URLSearchParams(
        window.location.search
      ).get('session')}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}`

      window.location.replace(window.location.origin)
    }

    if (document.cookie.includes('session')) {
      verifyToken()
    } else {
      failAuth()
    }
  }, [])

  return children(isAuthed)
}

export default SSOAuthProvider
