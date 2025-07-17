import { ReactNode, createContext, useContext, useMemo } from 'react'

interface IContextData {
  apiHost: string
  theme: 'light' | 'dark' | 'system'
  themeColor: string
  bgTemp: string
  bgImage: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setThemeColor: (color: string) => void
  setBgTemp: (color: string) => void
  setBgImage: (image: string) => void
  language: string
  toggleSidebar?: () => void
  sidebarExpanded?: boolean
}

const LifeforgeUIContext = createContext<IContextData | undefined>(undefined)

interface LifeforgeUIProviderProps {
  children: ReactNode
  personalization?: Partial<IContextData>
}

export const LifeforgeUIProvider: React.FC<LifeforgeUIProviderProps> = ({
  children,
  personalization
}: LifeforgeUIProviderProps) => {
  const memoizedValue = useMemo<IContextData>(() => {
    return {
      apiHost: '',
      theme: 'dark',
      themeColor: 'lime',
      bgTemp: 'zinc',
      bgImage: '',
      setTheme: () => {},
      setThemeColor: () => {},
      setBgTemp: () => {},
      setBgImage: () => {},
      language: 'en',
      toggleSidebar: () => {},
      sidebarExpanded: true,
      ...personalization
    }
  }, [
    personalization?.apiHost,
    personalization?.theme,
    personalization?.themeColor,
    personalization?.bgTemp,
    personalization?.bgImage,
    personalization?.language,
    personalization?.sidebarExpanded
  ])

  return (
    <LifeforgeUIContext.Provider value={memoizedValue}>
      {children}
    </LifeforgeUIContext.Provider>
  )
}

export const useLifeforgeUIContext = () => {
  const context = useContext(LifeforgeUIContext)
  if (context === undefined) {
    throw new Error(
      'useLifeforgeUIContext must be used within a LifeforgeUIProvider'
    )
  }
  return context
}
