import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'

interface IGlobalState {
  sidebarExpanded: boolean
  toggleSidebar: () => void
  subSidebarExpanded: boolean
  setSubSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalStateContext = createContext<IGlobalState | undefined>(undefined)

export default function GlobalStateProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const location = useLocation()
  const [navbarExpanded, setNavbarExpanded] = useState(true)
  const [subSidebarExpanded, setSubSidebarExpanded] = useState(false)

  function toggleNavbarExpanded(): void {
    setNavbarExpanded(!navbarExpanded)
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setNavbarExpanded(false)
    }
  }, [])

  useEffect(() => {
    setSubSidebarExpanded(false)
  }, [location])

  return (
    <GlobalStateContext
      value={{
        sidebarExpanded: navbarExpanded,
        toggleSidebar: toggleNavbarExpanded,
        subSidebarExpanded,
        setSubSidebarExpanded
      }}
    >
      {children}
    </GlobalStateContext>
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
