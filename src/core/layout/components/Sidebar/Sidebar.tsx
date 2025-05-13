import { useSidebarState } from '@providers/SidebarStateProvider'
import clsx from 'clsx'
import { useState } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import SidebarBottomBar from './SidebarBottomBar'
import SidebarEventBanner from './SidebarEventBanner'
import SidebarHeader from './SidebarHeader'
import SidebarItems from './SidebarItems'

function Sidebar() {
  const { sidebarExpanded, toggleSidebar } = useSidebarState()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <aside
        className={clsx(
          'bg-bg-50 shadow-custom dark:bg-bg-900 lg:bg-bg-50/50 lg:dark:bg-bg-900/50 absolute top-0 left-0 z-9995 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl backdrop-blur-xs transition-all duration-300 lg:relative lg:backdrop-blur-xs',
          sidebarExpanded
            ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
            : 'w-0 min-w-0 sm:w-[5.4rem]'
        )}
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
