import { createContext, useContext, useState } from 'react'

const ModuleSidebarStateContext = createContext<
  | {
      isSidebarOpen: boolean
      setIsSidebarOpen: (isOpen: boolean) => void
    }
  | undefined
>(undefined)

const ModuleSidebarStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ModuleSidebarStateContext
      value={{
        isSidebarOpen,
        setIsSidebarOpen
      }}
    >
      {children}
    </ModuleSidebarStateContext>
  )
}

const useModuleSidebarState = () => {
  const context = useContext(ModuleSidebarStateContext)

  if (!context) {
    return {
      isSidebarOpen: false,
      setIsSidebarOpen: () => {}
    }
  }

  return context
}

export default ModuleSidebarStateProvider

export { useModuleSidebarState }
