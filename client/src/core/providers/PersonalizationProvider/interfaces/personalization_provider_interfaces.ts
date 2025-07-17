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
  derivedTheme: 'light' | 'dark'
  rawThemeColor: string
  derivedThemeColor: string
  bgTemp: string
  bgTempPalette: Record<number, string>
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

export type { IPersonalizationData, IBackdropFilters, DashboardLayoutType }
