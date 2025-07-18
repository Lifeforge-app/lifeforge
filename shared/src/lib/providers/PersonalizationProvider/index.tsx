import _ from 'lodash'
import { createContext, useContext, useMemo, useState } from 'react'

import { BG_THEME } from './constants/bg_theme'
import THEME_COLOR_HEX from './constants/theme_color_hex'
import useBgTempEffect from './hooks/useBgTempEffect'
import useFaviconEffect from './hooks/useFaviconEffect'
import useFontFamily from './hooks/useFontFamilyEffect'
import useLanguageEffect from './hooks/useLanguageEffect'
import useRawThemeColorEffect from './hooks/useRawThemeColorEffect'
import useThemeEffect from './hooks/useThemeEffect'
import type {
  IBackdropFilters,
  IDashboardLayout,
  IPersonalizationData
} from './interfaces/personalization_provider_interfaces'
import { getColorPalette } from './utils/themeColors'

const PersonalizationContext = createContext<IPersonalizationData | undefined>(
  undefined
)

export default function PersonalizationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [fontFamily, setFontFamily] = useState<string>('Onest')

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  const [rawThemeColor, setRawThemeColor] = useState('theme-lime')

  const [bgTemp, setBgTemp] = useState<
    'bg-slate' | 'bg-gray' | 'bg-neutral' | 'bg-zinc' | 'bg-stone' | string
  >('bg-neutral')

  const [bgImage, setBgImage] = useState('')

  const [language, setLanguage] = useState('en')

  const [dashboardLayout, setDashboardLayout] = useState<IDashboardLayout>({})

  const [backdropFilters, setBackdropFilters] = useState<IBackdropFilters>({
    blur: 'none',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    overlayOpacity: 50
  })

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

  useFontFamily(fontFamily)
  useThemeEffect(derivedTheme, rawThemeColor, bgTemp)
  useRawThemeColorEffect(rawThemeColor, derivedTheme)
  useBgTempEffect(bgTemp, derivedTheme)
  useLanguageEffect(language)
  useFaviconEffect(themeColor)

  const value = useMemo<IPersonalizationData>(
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
      setDashboardLayout,
      setRawThemeColor,
      setFontFamily,
      setTheme,
      setBgTemp,
      setBgImage,
      setBackdropFilters,
      setLanguage
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
