import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

interface ISidebarState {
  sidebarExpanded: boolean
  toggleSidebar: () => void
}

const SidebarStateContext = createContext<ISidebarState | undefined>(undefined)

export default function MainSidebarStateProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded(prev => !prev)
  }, [])

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarExpanded(false)
    }
  }, [])

  const memoizedValue = useMemo(
    () => ({
      sidebarExpanded,
      toggleSidebar
    }),
    [sidebarExpanded, toggleSidebar]
  )

  return (
    <SidebarStateContext value={memoizedValue}>{children}</SidebarStateContext>
  )
}

export function useMainSidebarState(): ISidebarState {
  const context = useContext(SidebarStateContext)

  return (
    context || {
      sidebarExpanded: true,
      toggleSidebar: () => {}
    }
  )
}
