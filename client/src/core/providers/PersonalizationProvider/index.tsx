import { LoadingScreen } from 'lifeforge-ui'
import _ from 'lodash'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { useAuth } from '../AuthProvider'
import { BG_THEME } from './constants/bg_theme'
import THEME_COLOR_HEX from './constants/theme_color_hex'
import useBgTempEffect from './hooks/useBgTempEffect'
import useFaviconEffect from './hooks/useFaviconEffect'
import useFontFamily from './hooks/useFontFamilyEffect'
import useLanguageEffect from './hooks/useLanguageEffect'
import useRawThemeColorEffect from './hooks/useRawThemeColorEffect'
import useThemeEffect from './hooks/useThemeEffect'
import {
  DashboardLayoutType,
  IBackdropFilters,
  IPersonalizationData
} from './interfaces/personalization_provider_interfaces'
import { getColorPalette } from './utils/themeColors'

async function updateUserData(data: Record<string, unknown>) {
  try {
    await fetchAPI(import.meta.env.VITE_API_URL, '/user/personalization', {
      method: 'PATCH',
      body: {
        data
      }
    })
  } catch {
    toast.error('Failed to update personalization settings')
  }
}

const PersonalizationContext = createContext<IPersonalizationData | undefined>(
  undefined
)

export default function PersonalizationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { userData } = useAuth()

  const [fontFamily, setFontFamily] = useState<string>('Onest')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [rawThemeColor, setRawThemeColor] = useState('theme-lime')
  const [bgTemp, setBgTemp] = useState<
    'bg-slate' | 'bg-gray' | 'bg-neutral' | 'bg-zinc' | 'bg-stone' | string
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
  const [languageLoaded, setLanguageLoaded] = useState(false)

  const derivedTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme
  }, [theme])

  const themeColor = useMemo(
    () =>
      !rawThemeColor.startsWith('#')
        ? THEME_COLOR_HEX[
            _.camelCase(
              rawThemeColor.replace('theme-', '').replace(/-/g, ' ')
            ) as keyof typeof THEME_COLOR_HEX
          ]
        : rawThemeColor,
    [rawThemeColor]
  )

  const bgTempPalette = useMemo(() => {
    return !bgTemp.startsWith('#')
      ? BG_THEME[bgTemp.replace('bg-', '') as keyof typeof BG_THEME]
      : getColorPalette(bgTemp, 'bg', derivedTheme)
  }, [bgTemp])

  useEffect(() => {
    if (!userData) return

    if (userData?.theme !== '') {
      setTheme(userData.theme)
    }

    if (userData?.color !== '') {
      setRawThemeColor(
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

    if (userData?.fontFamily !== undefined) {
      setFontFamily(userData.fontFamily)
    }
  }, [userData])

  useFontFamily(fontFamily)
  useThemeEffect(derivedTheme, rawThemeColor, bgTemp)
  useRawThemeColorEffect(rawThemeColor, derivedTheme)
  useBgTempEffect(bgTemp, derivedTheme)
  useLanguageEffect(language, setLanguageLoaded)
  useFaviconEffect(themeColor)

  async function changeFontFamily(font: string) {
    setFontFamily(font)
    await updateUserData({ fontFamily: font })
  }

  async function changeTheme(theme: 'light' | 'dark' | 'system') {
    setTheme(theme)
    await updateUserData({ theme })
  }

  async function changeThemeColor(color: string) {
    setRawThemeColor(color)
    await updateUserData({ color: color.replace('theme-', '') })
  }

  async function changeBgTemp(color: string) {
    setBgTemp(color)
    await updateUserData({ bgTemp: color.replace('bg-', '') })
  }

  async function changeBackdropFilters(filters: IBackdropFilters) {
    setBackdropFilters(filters)
    await updateUserData({ backdropFilters: filters })
  }

  async function changeLanguage(language: string) {
    setLanguage(language)
    await updateUserData({ language })
  }

  async function changeDashboardLayout(layout: DashboardLayoutType) {
    setDashboardLayout(layout)
    await updateUserData({ dashboardLayout: layout })
  }

  const value = useMemo(
    () => ({
      fontFamily,
      theme,
      derivedTheme,
      rawThemeColor,
      derivedThemeColor: themeColor,
      bgTemp,
      bgTempPalette,
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
    }),
    [
      fontFamily,
      theme,
      rawThemeColor,
      themeColor,
      bgTemp,
      bgTempPalette,
      bgImage,
      backdropFilters,
      language,
      dashboardLayout
    ]
  )

  return (
    <PersonalizationContext value={value}>
      {!languageLoaded ? (
        <LoadingScreen />
      ) : (
        <>
          <meta
            content={
              rawThemeColor.startsWith('#')
                ? rawThemeColor
                : THEME_COLOR_HEX[
                    rawThemeColor.replace(
                      'theme-',
                      ''
                    ) as keyof typeof THEME_COLOR_HEX
                  ]
            }
            name="theme-color"
          />
          {children}
        </>
      )}
    </PersonalizationContext>
  )
}

export function usePersonalization(): IPersonalizationData {
  const context = useContext(PersonalizationContext)
  if (context === undefined) {
    throw new Error(
      'usePersonalizationContext must be used within a PersonalizationProvider'
    )
  }
  return context
}
