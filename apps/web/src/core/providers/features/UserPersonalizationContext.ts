import { createContext, useContext } from 'react'

import type { IBackdropFilters, IDashboardLayout } from '@lifeforge/ui'

export const UserPersonalizationContext = createContext<{
  changeFontFamily: (font: string) => Promise<void>
  changeFontScale: (scale: number) => Promise<void>
  changeTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>
  changeThemeColor: (color: string) => Promise<void>
  changeBgTemp: (color: string) => Promise<void>
  changeBackdropFilters: (filters: IBackdropFilters) => Promise<void>
  changeLanguage: (language: string) => Promise<void>
  changeDashboardLayout: (layout: IDashboardLayout) => Promise<void>
  changeBorderRadiusMultiplier: (multiplier: number) => Promise<void>
  changeBordered: (bordered: boolean) => Promise<void>
} | null>(null)

export function useUserPersonalization() {
  const context = useContext(UserPersonalizationContext)

  if (!context) {
    throw new Error(
      'useUserPersonalization must be used within a UserPersonalizationProvider'
    )
  }

  return context
}
