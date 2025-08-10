import forgeAPI from '@utils/forgeAPI'
import { createContext, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { type IBackdropFilters, type IDashboardLayout } from 'shared'
import { usePersonalization } from 'shared'

import { useAuth } from './AuthProvider'

const UserPersonalizationContext = createContext<{
  changeFontFamily: (font: string) => Promise<void>
  changeFontScale: (scale: number) => Promise<void>
  changeTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>
  changeThemeColor: (color: string) => Promise<void>
  changeBgTemp: (color: string) => Promise<void>
  changeBackdropFilters: (filters: IBackdropFilters) => Promise<void>
  changeLanguage: (language: string) => Promise<void>
  changeDashboardLayout: (layout: IDashboardLayout) => Promise<void>
}>({} as any)

async function syncUserData(data: Record<string, unknown>) {
  try {
    await forgeAPI.user.personalization.updatePersonalization.mutate({
      data
    })
  } catch {
    toast.error('Failed to update personalization settings')
  }
}

function UserPersonalizationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { userData } = useAuth()

  const {
    setFontFamily,
    setTheme,
    setRawThemeColor,
    setBgTemp,
    setBackdropFilters,
    setLanguage,
    setDashboardLayout,
    setFontScale,
    setBgImage
  } = usePersonalization()

  async function changeFontFamily(font: string) {
    setFontFamily(font)
    await syncUserData({ fontFamily: font })
  }

  async function changeFontScale(scale: number) {
    setFontScale(scale)
    await syncUserData({ fontScale: scale })
  }

  async function changeTheme(theme: 'light' | 'dark' | 'system') {
    setTheme(theme)
    await syncUserData({ theme })
  }

  async function changeThemeColor(color: string) {
    setRawThemeColor(color)
    await syncUserData({ color: color.replace('theme-', '') })
  }

  async function changeBgTemp(color: string) {
    setBgTemp(color)
    await syncUserData({ bgTemp: color.replace('bg-', '') })
  }

  async function changeBackdropFilters(filters: IBackdropFilters) {
    setBackdropFilters(filters)
    await syncUserData({ backdropFilters: filters })
  }

  async function changeLanguage(language: string) {
    setLanguage(language)
    await syncUserData({ language })
  }

  async function changeDashboardLayout(layout: IDashboardLayout) {
    setDashboardLayout(layout)
    await syncUserData({ dashboardLayout: layout })
  }

  useEffect(() => {
    if (!userData) return

    setTheme(userData.theme)

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
        forgeAPI.media.input({
          collectionId: userData.collectionId,
          recordId: userData.id,
          fieldId: userData.bgImage
        }).endpoint
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

    if (userData?.fontScale !== undefined) {
      setFontScale(userData.fontScale)
    }
  }, [userData])

  return (
    <UserPersonalizationContext.Provider
      value={{
        changeFontFamily,
        changeFontScale,
        changeTheme,
        changeThemeColor,
        changeBgTemp,
        changeBackdropFilters,
        changeLanguage,
        changeDashboardLayout
      }}
    >
      {children}
    </UserPersonalizationContext.Provider>
  )
}

export default UserPersonalizationProvider

export function useUserPersonalization() {
  const context = useContext(UserPersonalizationContext)

  if (!context) {
    throw new Error(
      'useUserPersonalization must be used within a UserPersonalizationProvider'
    )
  }

  return context
}
