import React, { createContext, useEffect, useState } from 'react'

const GLOBAL_STATE: {
  sidebarExpanded: boolean
  toggleSidebar: () => void
} = {
  sidebarExpanded: true,
  toggleSidebar: () => {}
}

export const GlobalStateContext = createContext(GLOBAL_STATE)

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
