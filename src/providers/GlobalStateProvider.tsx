import React, { createContext, useContext, useEffect, useState } from 'react'

interface IGlobalState {
  sidebarExpanded: boolean
  toggleSidebar: () => void
}

const GlobalStateContext = createContext<IGlobalState | undefined>(undefined)

export default function GlobalStateProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [navbarExpanded, setNavbarExpanded] = useState(true)

  function toggleNavbarExpanded(): void {
    setNavbarExpanded(!navbarExpanded)
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setNavbarExpanded(false)
    }
  }, [])

  return (
    <GlobalStateContext.Provider
      value={{
        sidebarExpanded: navbarExpanded,
        toggleSidebar: toggleNavbarExpanded
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}

export function useGlobalStateContext(): IGlobalState {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error(
      'useGlobalStateContext must be used within a GlobalStateProvider'
    )
  }
  return context
}
