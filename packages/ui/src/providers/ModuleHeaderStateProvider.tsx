import { createContext, useContext } from 'react'

const ModuleHeaderStateContext = createContext<
  | {
      icon: string
      title: string
    }
  | undefined
>(undefined)

export default ModuleHeaderStateContext

export const useModuleHeaderState = () => {
  const context = useContext(ModuleHeaderStateContext)

  if (!context) {
    return {
      icon: 'tabler:cube',
      title: 'Untitled Module'
    }
  }

  return context
}
