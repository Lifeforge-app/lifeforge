import React, { createContext, useContext, useEffect, useState } from 'react'

interface ISidebarState {
  sidebarExpanded: boolean
  toggleSidebar: () => void
}

const SidebarStateContext = createContext<ISidebarState | undefined>(undefined)

export default function SidebarStateProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  function toggleSidebar(): void {
    setSidebarExpanded(!sidebarExpanded)
  }

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarExpanded(false)
    }
  }, [])

  return (
    <SidebarStateContext
      value={{
        sidebarExpanded,
        toggleSidebar
      }}
    >
      {children}
    </SidebarStateContext>
  )
}

export function useSidebarState(): ISidebarState {
  const context = useContext(SidebarStateContext)
  if (context === undefined) {
    throw new Error(
      'useSidebarState must be used within a SidebarStateProvider'
    )
  }
  return context
}
