import { createContext, useContext } from 'react'

export const ModuleMetadataProvider = createContext<
  | {
      name?: string
      icon: string
      title: string
    }
  | undefined
>(undefined)

export function useModuleMetadata() {
  const context = useContext(ModuleMetadataProvider)

  if (!context) {
    return {
      name: '',
      icon: 'tabler:cube',
      title: 'Untitled Module'
    }
  }

  return context
}
