import React, { useState } from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarBottomBar from './SidebarBottomBar'
import SidebarEventBanner from './SidebarEventBanner'
import SidebarHeader from './SidebarHeader'
import SidebarItem from './SidebarItem'
import SidebarItems from './SidebarItems'

function Sidebar(): React.ReactElement {
  const { sidebarExpanded, toggleSidebar } = useGlobalStateContext()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <aside
        className={`${
          sidebarExpanded
            ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
            : 'w-0 min-w-0 sm:w-[5.4rem]'
        } absolute left-0 top-0 z-9990 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl bg-bg-50 shadow-custom backdrop-blur-xs transition-all duration-300 dark:bg-bg-900 lg:relative lg:bg-bg-50/50 lg:backdrop-blur-xs lg:dark:bg-bg-900/50`}
      >
        <SidebarEventBanner />
        <SidebarHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <SidebarItems query={searchQuery} />
        {!sidebarExpanded && (
          <SidebarItem
            active={false}
            icon="tabler:layout-sidebar-left-expand"
            name=""
            onClick={toggleSidebar}
          />
        )}
        <SidebarBottomBar />
      </aside>
    </>
  )
}

export default Sidebar
