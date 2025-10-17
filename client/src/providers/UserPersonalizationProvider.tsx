import forgeAPI from '@/utils/forgeAPI'
import { createContext, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { type IBackdropFilters, type IDashboardLayout } from 'shared'
import { usePersonalization } from 'shared'
import { useAuth } from 'shared'

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

async function syncUserData(
  data: Record<string, unknown>,
  setUserData: React.Dispatch<React.SetStateAction<any>>
) {
  try {
    await forgeAPI.user.personalization.updatePersonalization.mutate({
      data
    })

    if (setUserData) {
      setUserData((oldData: any) => {
        if (!oldData) return oldData

        return { ...oldData, ...data }
      })
    }
  } catch {
    toast.error('Failed to update personalization settings')
  }
}

function UserPersonalizationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { userData, setUserData } = useAuth()

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
    await syncUserData({ fontFamily: font }, setUserData)
  }

  async function changeFontScale(scale: number) {
    await syncUserData({ fontScale: scale }, setUserData)
  }

  async function changeTheme(theme: 'light' | 'dark' | 'system') {
    await syncUserData({ theme }, setUserData)
  }

  async function changeThemeColor(color: string) {
    await syncUserData({ color: color.replace('theme-', '') }, setUserData)
  }

  async function changeBgTemp(color: string) {
    await syncUserData({ bgTemp: color.replace('bg-', '') }, setUserData)
  }

  async function changeBackdropFilters(filters: IBackdropFilters) {
    await syncUserData({ backdropFilters: filters }, setUserData)
  }

  async function changeLanguage(language: string) {
    await syncUserData({ language }, setUserData)
  }

  async function changeDashboardLayout(layout: IDashboardLayout) {
    await syncUserData({ dashboardLayout: layout }, setUserData)
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
