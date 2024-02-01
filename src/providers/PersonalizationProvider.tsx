/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet'
import THEME_COLOR_HEX from '../constants/theme_color_hex'

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
    if (userData?.theme !== undefined && userData?.color !== undefined) {
      setTheme(userData.theme)
      setThemeColor(`theme-${userData.color}`)
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

  useEffect(() => {
    if (themeColor) {
      document.body.classList.remove(
        ...[
          'theme-red',
          'theme-pink',
          'theme-purple',
          'theme-deep-purple',
          'theme-indigo',
          'theme-blue',
          'theme-light-blue',
          'theme-cyan',
          'theme-teal',
          'theme-green',
          'theme-light-green',
          'theme-lime',
          'theme-yellow',
          'theme-amber',
          'theme-orange',
          'theme-deep-orange',
          'theme-brown',
          'theme-grey'
        ]
      )
      document.body.classList.add(themeColor)
    }
  }, [themeColor])

  function changeTheme(color: 'light' | 'dark' | 'system'): void {
    setTheme(color)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          theme: color
        }
      })
    })
      .then(async response => {
        const data = await response.json()
        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        toast.error('Failed to update personalization settings.')
      })
  }

  function changeThemeColor(color: string): void {
    setThemeColor(color)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          color: color.replace('theme-', '')
        }
      })
    })
      .then(async response => {
        const data = await response.json()
        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        toast.error('Failed to update personalization settings.')
      })
  }

  return (
    <PersonalizationContext.Provider
      value={{
        theme,
        themeColor,
        setTheme: changeTheme,
        setThemeColor: changeThemeColor
      }}
    >
      <Helmet>
        <meta
          name="theme-color"
          content={
            THEME_COLOR_HEX[
              themeColor.replace('theme-', '') as keyof typeof THEME_COLOR_HEX
            ]
          }
        />
      </Helmet>
      {children}
    </PersonalizationContext.Provider>
  )
}

export default PersonalizationProvider
