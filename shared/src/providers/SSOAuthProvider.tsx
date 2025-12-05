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
    localStorage.removeItem('session')
    setIsAuthed(false)
  }

  const verifyToken = async () => {
    try {
      // First verify session token (unencrypted)
      const response = await forgeAPI.user.auth.verifySessionToken.mutateRaw({})

      if (response.state !== 'success') {
        throw new Error('Invalid session')
      }

      // Then fetch user data (encrypted)
      const userData = await forgeAPI.user.auth.getUserData.query()

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
      localStorage.setItem(
        'session',
        new URLSearchParams(window.location.search).get('session') || ''
      )

      window.location.replace(window.location.origin)
    }

    if (localStorage.getItem('session')) {
      verifyToken()
    } else {
      failAuth()
    }
  }, [])

  return children(isAuthed)
}

export default SSOAuthProvider
