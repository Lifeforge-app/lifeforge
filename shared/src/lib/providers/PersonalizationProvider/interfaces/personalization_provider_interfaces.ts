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

  setFontFamily: React.Dispatch<React.SetStateAction<string>>
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>
  setRawThemeColor: React.Dispatch<React.SetStateAction<string>>
  setBgTemp: React.Dispatch<React.SetStateAction<string>>
  setBgImage: React.Dispatch<React.SetStateAction<string>>
  setBackdropFilters: React.Dispatch<React.SetStateAction<IBackdropFilters>>
  setLanguage: React.Dispatch<React.SetStateAction<string>>
  setDashboardLayout: React.Dispatch<React.SetStateAction<DashboardLayoutType>>
}

export type { IPersonalizationData, IBackdropFilters, DashboardLayoutType }
