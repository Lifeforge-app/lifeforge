/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider'

const PERSONALIZATION_DATA: {
  theme: 'light' | 'dark' | 'system'
  themeColor: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setThemeColor: (color: string) => void
} = {
  theme: 'system',
  themeColor: 'theme-blue',
  setTheme: () => {},
  setThemeColor: () => {}
}

export const PersonalizationContext = createContext(PERSONALIZATION_DATA)

function PersonalizationProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { userData } = useContext(AuthContext)

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [themeColor, setThemeColor] = useState('theme-blue')

  useEffect(() => {
    if (userData?.theme !== undefined && userData?.themeColor !== undefined) {
      setTheme(userData.theme)
      setThemeColor(userData.themeColor)
    }
  }, [userData])

  useEffect(() => {
    if (
      (theme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      theme === 'dark'
    ) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [theme])

  return (
    <PersonalizationContext.Provider
      value={{
        theme,
        themeColor,
        setTheme,
        setThemeColor
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  )
}

export default PersonalizationProvider
