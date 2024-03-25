import React, { createContext, useEffect, useState } from 'react'
import usePocketbase from '../hooks/usePocketbase'
import type Pocketbase from 'pocketbase'

const GLOBAL_STATE: {
  sidebarExpanded: boolean
  toggleSidebar: () => void
  pocketbase: {
    pocketbase: Pocketbase | null
    loading: boolean
    error: any
  }
} = {
  sidebarExpanded: true,
  toggleSidebar: () => {},
  pocketbase: {
    pocketbase: null,
    loading: false,
    error: null
  }
}

export const GlobalStateContext = createContext(GLOBAL_STATE)

export default function GlobalStateProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [navbarExpanded, setNavbarExpanded] = useState(true)
  const { pocketbase, loading, error } = usePocketbase()

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
        toggleSidebar: toggleNavbarExpanded,
        pocketbase: {
          pocketbase,
          loading,
          error
        }
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
