import React from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarHeader from './components/SidebarHeader'
import SidebarItems from './components/SidebarItems'

export default function Sidebar(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()

  return (
    <aside
      className={`${
        sidebarExpanded
          ? 'w-full sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 sm:w-[5.4rem]'
      } absolute left-0 top-0 z-[9998] flex h-full shrink-0 flex-col rounded-r-2xl bg-bg-50 shadow-custom duration-300 dark:bg-bg-900 lg:relative lg:dark:bg-bg-900`}
    >
      <SidebarHeader />
      <SidebarItems />
    </aside>
  )
}
