import type { ClientTree } from '@shared/api/typescript/forge_api_client.types'
import _ from 'lodash'
import { createContext, useContext, useMemo, useState } from 'react'

import { BG_THEME } from './constants/bg_theme'
import THEME_COLOR_HEX from './constants/theme_color_hex'
import useBgTempEffect from './hooks/useBgTempEffect'
import useBorderRadiusEffect from './hooks/useBorderRadiusEffect'
import useBorderedEffect from './hooks/useBorderedEffect'
import useFontFamily from './hooks/useFontFamilyEffect'
import useLanguageEffect from './hooks/useLanguageEffect'
import useMetaEffect from './hooks/useMetaEffect'
import useRawThemeColorEffect from './hooks/useRawThemeColorEffect'
import useThemeEffect from './hooks/useThemeEffect'
import type {
  IBackdropFilters,
  IDashboardLayout,
  IPersonalizationData
} from './interfaces/personalization_provider_interfaces'
import { getColorPalette } from './utils/themeColors'

const DEFAULT_VALUE: IPersonalizationData = {
  rootElement: document.body,
  fontFamily: 'Onest',
  fontScale: 1,
  borderRadiusMultiplier: 1,
  bordered: false,
  theme: 'system',
  derivedTheme: 'dark',
  rawThemeColor: 'theme-lime',
  derivedThemeColor: THEME_COLOR_HEX['lime'],
  bgTemp: 'bg-neutral',
  bgTempPalette: BG_THEME['zinc'],
  bgImage: '',
  backdropFilters: {
    blur: 'none',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    overlayOpacity: 50
  },
  dashboardLayout: {},
  language: 'en',
  setDashboardLayout: () => {},
  setRawThemeColor: () => {},
  setFontFamily: () => {},
  setFontScale: () => {},
  setBorderRadiusMultiplier: () => {},
  setBordered: () => {},
  setTheme: () => {},
  setBgTemp: () => {},
  setBgImage: () => {},
  setBackdropFilters: () => {},
  setLanguage: () => {}
}

const PersonalizationContext = createContext<IPersonalizationData | undefined>(
  DEFAULT_VALUE
)

export default function PersonalizationProvider({
  forgeAPI,
  defaultValueOverride = {},
  children
}: {
  forgeAPI: ClientTree<any>
  defaultValueOverride?: Partial<IPersonalizationData>
  children: React.ReactNode
}) {
  const defaultValue = useMemo(() => {
    return {
      ...DEFAULT_VALUE,
      ...defaultValueOverride
    }
  }, [defaultValueOverride])

  const rootElement = defaultValue.rootElement || document.body

  const [fontFamily, setFontFamily] = useState<string>(defaultValue.fontFamily)

  const [fontScale, setFontScale] = useState<number>(defaultValue.fontScale)

  const [borderRadiusMultiplier, setBorderRadiusMultiplier] = useState<number>(
    defaultValue.borderRadiusMultiplier
  )

  const [bordered, setBordered] = useState<boolean>(defaultValue.bordered)

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    defaultValue.theme
  )

  const [rawThemeColor, setRawThemeColor] = useState(defaultValue.rawThemeColor)

  const [bgTemp, setBgTemp] = useState<
    'bg-slate' | 'bg-gray' | 'bg-neutral' | 'bg-zinc' | 'bg-stone' | string
  >(defaultValue.bgTemp)

  const [bgImage, setBgImage] = useState(defaultValue.bgImage)

  const [language, setLanguage] = useState(defaultValue.language)

  const [dashboardLayout, setDashboardLayout] = useState<IDashboardLayout>(
    defaultValue.dashboardLayout
  )

  const [backdropFilters, setBackdropFilters] = useState<IBackdropFilters>(
    defaultValue.backdropFilters
  )

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

  useFontFamily(fontFamily, fontScale, forgeAPI)
  useThemeEffect(rootElement, derivedTheme, rawThemeColor, bgTemp)
  useRawThemeColorEffect(rootElement, rawThemeColor, derivedTheme)
  useBgTempEffect(rootElement, bgTemp, derivedTheme)
  useLanguageEffect(language)
  useMetaEffect(themeColor)
  useBorderRadiusEffect(borderRadiusMultiplier)
  useBorderedEffect(rootElement, bordered)

  const value = useMemo<IPersonalizationData>(
    () => ({
      rootElement,
      fontFamily,
      fontScale,
      borderRadiusMultiplier,
      bordered,
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
      setFontScale,
      setBorderRadiusMultiplier,
      setBordered,
      setTheme,
      setBgTemp,
      setBgImage,
      setBackdropFilters,
      setLanguage
    }),
    [
      rootElement,
      fontFamily,
      fontScale,
      borderRadiusMultiplier,
      bordered,
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

  return context || DEFAULT_VALUE
}
