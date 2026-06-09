import { createContext, useContext } from 'react'

export const ModuleHeaderStateProvider = createContext<
  | {
      icon: string
      title: string
    }
  | undefined
>(undefined)

export const useModuleHeaderState = () => {
  const context = useContext(ModuleHeaderStateProvider)

  if (!context) {
    return {
      icon: 'tabler:cube',
      title: 'Untitled Module'
    }
  }

  return context
}
