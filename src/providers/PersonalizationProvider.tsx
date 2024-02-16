/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet'
import THEME_COLOR_HEX from '../constants/theme_color_hex'
import { cookieParse } from 'pocketbase'

const PERSONALIZATION_DATA: {
  theme: 'light' | 'dark' | 'system'
  themeColor: string
  bgTemp: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setThemeColor: (color: string) => void
  setBgTemp: (color: string) => void
} = {
  theme: 'system',
  themeColor: 'theme-blue',
  bgTemp: 'bg-neutral',
  setTheme: () => {},
  setThemeColor: () => {},
  setBgTemp: () => {}
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
  const [bgTemp, setBgTemp] = useState('bg-neutral')

  useEffect(() => {
    if (userData?.theme !== undefined) {
      setTheme(userData.theme)
    }

    if (userData?.color !== undefined) {
      setThemeColor(`theme-${userData.color}`)
    }

    if (userData?.bgTemp !== undefined) {
      setBgTemp(`bg-${userData.bgTemp}`)
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

  useEffect(() => {
    if (bgTemp) {
      document.body.classList.remove(
        'bg-slate',
        'bg-gray',
        'bg-neutral',
        'bg-zinc',
        'bg-stone'
      )
      document.body.classList.add(bgTemp)
    }
  }, [bgTemp])

  function changeTheme(color: 'light' | 'dark' | 'system'): void {
    setTheme(color)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
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
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
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

  function changeBgTemp(color: string): void {
    setBgTemp(color)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          bgTemp: color.replace('bg-', '')
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
        bgTemp,
        setTheme: changeTheme,
        setThemeColor: changeThemeColor,
        setBgTemp: changeBgTemp
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
