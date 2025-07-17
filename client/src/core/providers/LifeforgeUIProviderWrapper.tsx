import { LifeforgeUIProvider } from 'lifeforge-ui'

import { usePersonalization } from './PersonalizationProvider'
import { useSidebarState } from './SidebarStateProvider'

function LifeforgeUIProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const personalization = usePersonalization()
  const { toggleSidebar, sidebarExpanded } = useSidebarState()

  return (
    <LifeforgeUIProvider
      personalization={{
        apiHost: import.meta.env.VITE_API_HOST,
        ...personalization,
        themeColor: personalization.rawThemeColor,
        sidebarExpanded,
        toggleSidebar
      }}
    >
      {children}
    </LifeforgeUIProvider>
  )
}

export default LifeforgeUIProviderWrapper
