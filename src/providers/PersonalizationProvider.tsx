import { cookieParse } from 'pocketbase'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getColorPalette, hexToRgb } from '@utils/colors'
import { useAuthContext } from './AuthProvider'
import THEME_COLOR_HEX from '../constants/theme_color_hex'
import { type IFontFamily } from '../modules/Personalization/components/FontFamilySelector'

type DashboardLayoutType = Record<
  string,
  Array<{
    x: number
    y: number
    w: number
    h: number
    i: string
    minW: number
    minH: number
  }>
>

interface IBackdropFilters {
  blur: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  brightness: number
  contrast: number
  saturation: number
  overlayOpacity: number
}

interface IPersonalizationData {
  fontFamily: string
  theme: 'light' | 'dark' | 'system'
  themeColor: string
  bgTemp: string
  backdropFilters: IBackdropFilters
  bgImage: string
  language: string
  dashboardLayout: DashboardLayoutType
  setFontFamily: (font: string) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setThemeColor: (color: string) => void
  setBgTemp: (color: string) => void
  setBgImage: (image: string) => void
  setBackdropFilters: (filters: IBackdropFilters) => void
  setLanguage: (language: string) => void
  setDashboardLayout: (layout: DashboardLayoutType) => void
  setDashboardLayoutWithoutPost: React.Dispatch<
    React.SetStateAction<DashboardLayoutType>
  >
}

const PersonalizationContext = createContext<IPersonalizationData | undefined>(
  undefined
)

export default function PersonalizationProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const { userData } = useAuthContext()
  const { i18n } = useTranslation()

  const [fontFamily, setFontFamily] = useState<string>('Wix Madefor Text')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [themeColor, setThemeColor] = useState('theme-lime')
  const [bgTemp, setBgTemp] = useState<
    'bg-slate' | 'bg-gray' | 'bg-neutral' | 'bg-zinc' | 'bg-stone'
  >('bg-neutral')
  const [bgImage, setBgImage] = useState('')
  const [language, setLanguage] = useState('en')
  const [dashboardLayout, setDashboardLayout] = useState<DashboardLayoutType>(
    {}
  )
  const [backdropFilters, setBackdropFilters] = useState<IBackdropFilters>({
    blur: 'none',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    overlayOpacity: 50
  })

  function clearCustomColorProperties(type: 'bg' | 'theme'): void {
    const number = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (let i = 0; i < number.length; i++) {
      document.body.style.removeProperty(
        `--color-${type === 'bg' ? 'bg' : 'custom'}-${number[i]}`
      )
    }
  }

  function interpolateColors(color: string, type: 'bg' | 'theme'): void {
    const colorPalette = getColorPalette(
      color,
      type,
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme
    )

    Object.entries(colorPalette).forEach(([key, value]) => {
      document.body.style.setProperty(
        `--color-${type === 'bg' ? 'bg' : 'custom'}-${key}`,
        hexToRgb(value).join(' ')
      )
    })
  }

  useEffect(() => {
    if (!userData) return

    if (userData?.theme !== '') {
      setTheme(userData.theme)
    }

    if (userData?.color !== '') {
      setThemeColor(
        userData.color.startsWith('#')
          ? userData.color
          : `theme-${userData.color}`
      )
    }

    if (userData?.bgTemp !== '') {
      setBgTemp(
        userData.bgTemp.startsWith('#')
          ? userData.bgTemp
          : `bg-${userData.bgTemp}`
      )
    }

    if (userData?.backdropFilters) {
      setBackdropFilters(userData.backdropFilters)
    }

    if (userData?.bgImage !== '') {
      setBgImage(
        `${import.meta.env.VITE_API_HOST}/media/${userData?.collectionId}/${
          userData?.id
        }/${userData?.bgImage}`
      )
    }

    if (userData?.language !== '') {
      setLanguage(userData.language)
    }

    if (userData?.dashboardLayout !== '') {
      setDashboardLayout(userData.dashboardLayout)
    }
    // test

    if (userData?.fontFamily !== undefined) {
      setFontFamily(userData.fontFamily)
    }
  }, [userData])

  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?family=${fontFamily.replace(
        / /g,
        '+'
      )}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    )
      .then(async res => {
        const data = (await res.json()) as {
          items: IFontFamily[]
        }
        if (data.items) {
          const sheet = window.document.styleSheets[0]

          data.items.forEach(font => {
            Object.entries(font.files).forEach(([variant, url]) => {
              const fontFace = `@font-face {
                font-family: '${font.family}';
                src: url('${url}');
                ${
                  !['regular', 'italic'].includes(variant)
                    ? `font-weight: ${variant.replace('italic', '')};`
                    : ''
                }
                font-style: ${variant.includes('italic') ? 'italic' : 'normal'};
                font-display: swap;
            }`

              try {
                sheet.insertRule(fontFace, sheet.cssRules.length)
              } catch (err) {
                console.error(fontFace)
                console.error(err)
              }

              document.body.style.fontFamily = `${font.family}, sans-serif`
            })
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [fontFamily])

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

    clearCustomColorProperties('theme')
    clearCustomColorProperties('bg')

    if (themeColor.startsWith('#')) {
      interpolateColors(themeColor, 'theme')
    }

    if (bgTemp.startsWith('#')) {
      interpolateColors(bgTemp, 'bg')
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
          'theme-grey',
          'theme-custom'
        ]
      )

      clearCustomColorProperties('theme')

      document.body.classList.add(
        themeColor.startsWith('#') ? 'theme-custom' : themeColor
      )

      if (themeColor.startsWith('#')) {
        interpolateColors(themeColor, 'theme')
      }
    }
  }, [themeColor])

  useEffect(() => {
    if (bgTemp) {
      document.body.classList.remove(
        'bg-slate',
        'bg-gray',
        'bg-neutral',
        'bg-zinc',
        'bg-stone',
        'bg-custom'
      )
      document.body.classList.add(bgTemp.startsWith('#') ? 'bg-custom' : bgTemp)
    }

    clearCustomColorProperties('bg')

    if (bgTemp.startsWith('#')) {
      interpolateColors(bgTemp, 'bg')
    }
  }, [bgTemp])

  useEffect(() => {
    if (!userData) return

    i18n.changeLanguage(language).catch(() => {
      toast.error('Failed to change language.')
    })
  }, [language])

  function changeFontFamily(font: string): void {
    setFontFamily(font)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          fontFamily: font
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
    setBgTemp(color as any)
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

  function changeBackdropFilters(filters: IBackdropFilters): void {
    setBackdropFilters(filters)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          backdropFilters: filters
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

  function changeLanguage(language: string): void {
    setLanguage(language)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          language
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

  function changeDashboardLayout(layout: DashboardLayoutType): void {
    setDashboardLayout(layout)
    fetch(`${import.meta.env.VITE_API_HOST}/user/personalization`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: {
          dashboardLayout: layout
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
    <PersonalizationContext
      value={{
        fontFamily,
        theme,
        themeColor,
        bgTemp,
        bgImage,
        backdropFilters,
        language,
        dashboardLayout,
        setFontFamily: changeFontFamily,
        setTheme: changeTheme,
        setThemeColor: changeThemeColor,
        setBgTemp: changeBgTemp,
        setBgImage,
        setBackdropFilters: changeBackdropFilters,
        setLanguage: changeLanguage,
        setDashboardLayoutWithoutPost: setDashboardLayout,
        setDashboardLayout: changeDashboardLayout
      }}
    >
      <meta
        name="theme-color"
        content={
          themeColor.startsWith('#')
            ? themeColor
            : THEME_COLOR_HEX[
                themeColor.replace('theme-', '') as keyof typeof THEME_COLOR_HEX
              ]
        }
      />
      {children}
    </PersonalizationContext>
  )
}

export function usePersonalizationContext(): IPersonalizationData {
  const context = useContext(PersonalizationContext)
  if (context === undefined) {
    throw new Error(
      'usePersonalizationContext must be used within a PersonalizationProvider'
    )
  }
  return context
}
