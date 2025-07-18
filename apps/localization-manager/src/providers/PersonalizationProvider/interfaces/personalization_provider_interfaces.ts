interface IPersonalizationData {
  fontFamily: string
  theme: 'light' | 'dark' | 'system'
  derivedTheme: 'light' | 'dark'
  rawThemeColor: string
  derivedThemeColor: string
  bgTemp: string
  bgTempPalette: Record<number, string>
  language: string
}

export type { IPersonalizationData }
