import { useDebounce } from '@uidotdev/usehooks'
import React, { useState } from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarEventBanner from './components/SidebarEventBanner'
import SidebarHeader from './components/SidebarHeader'
import SidebarItems from './components/SidebarItems'

function Sidebar(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  return (
    <aside
      className={`${
        sidebarExpanded
          ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 min-w-0 sm:w-[5.4rem]'
      } absolute left-0 top-0 z-[9990] flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl bg-bg-50 shadow-custom backdrop-blur-sm transition-all duration-300 dark:bg-bg-900 lg:relative lg:bg-bg-50/50 lg:backdrop-blur-sm lg:dark:bg-bg-900/50`}
    >
      <SidebarEventBanner />
      <SidebarHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <SidebarItems query={debouncedSearchQuery} />
    </aside>
  )
}

export default Sidebar
