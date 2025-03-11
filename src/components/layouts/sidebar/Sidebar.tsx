import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import clsx from 'clsx'
import React, { useState } from 'react'

import { SidebarItem } from '@lifeforge/ui'

import SidebarBottomBar from '@components/layouts/sidebar/SidebarBottomBar'
import SidebarEventBanner from '@components/layouts/sidebar/SidebarEventBanner'

import SidebarHeader from './SidebarHeader'
import SidebarItems from './SidebarItems'

function Sidebar(): React.ReactElement {
  const { sidebarExpanded, toggleSidebar } = useGlobalStateContext()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <aside
        className={clsx(
          'bg-bg-50 shadow-custom dark:bg-bg-900 lg:bg-bg-50/50 lg:dark:bg-bg-900/50 z-9990 backdrop-blur-xs lg:backdrop-blur-xs absolute left-0 top-0 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl transition-all duration-300 lg:relative',
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
