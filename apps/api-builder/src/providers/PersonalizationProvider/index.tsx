import _ from 'lodash'
import { useMemo, useState } from 'react'

import { LoadingScreen } from '@lifeforge/ui'

import { BG_THEME } from './constants/bg_theme'
import THEME_COLOR_HEX from './constants/theme_color_hex'
import useBgTempEffect from './hooks/useBgTempEffect'
import useFaviconEffect from './hooks/useFaviconEffect'
import useFontFamily from './hooks/useFontFamilyEffect'
import useLanguageEffect from './hooks/useLanguageEffect'
import useRawThemeColorEffect from './hooks/useRawThemeColorEffect'
import useThemeEffect from './hooks/useThemeEffect'
import { PersonalizationContext } from './usePersonalization'
import { getColorPalette } from './utils/themeColors'

export default function PersonalizationProvider({
  children,
  isAuthed,
  config: { fontFamily, theme, rawThemeColor, bgTemp, language }
}: {
  children: React.ReactNode
  isAuthed: boolean
  config: {
    fontFamily: string
    theme: 'light' | 'dark' | 'system'
    rawThemeColor: string
    bgTemp: string
    language: string
  }
}) {
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

  useFontFamily(fontFamily)
  useThemeEffect(derivedTheme, rawThemeColor, bgTemp)
  useRawThemeColorEffect(rawThemeColor, derivedTheme)
  useBgTempEffect(bgTemp, derivedTheme)
  useLanguageEffect(isAuthed, language, setLanguageLoaded)
  useFaviconEffect(themeColor)

  const value = useMemo(
    () => ({
      fontFamily,
      theme,
      derivedTheme,
      rawThemeColor,
      derivedThemeColor: themeColor,
      bgTemp,
      bgTempPalette,
      language
    }),
    [
      fontFamily,
      theme,
      rawThemeColor,
      themeColor,
      bgTemp,
      bgTempPalette,
      language
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
