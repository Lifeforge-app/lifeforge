/* eslint-disable multiline-ternary */
import React, { useContext } from 'react'
import { GlobalStateContext } from '../../providers/GlobalStateProvider'
import SidebarItems from './components/SidebarItems'
import SidebarHeader from './components/SidebarHeader'

export default function Sidebar(): React.JSX.Element {
  const { sidebarExpanded } = useContext(GlobalStateContext)

  return (
    <aside
      className={`${
        sidebarExpanded
          ? 'w-full sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 sm:w-[5.4rem]'
      } absolute left-0 top-0 z-[9999] flex h-full shrink-0 flex-col rounded-r-2xl bg-bg-50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] duration-300 dark:bg-bg-800/50 lg:relative`}
    >
      <SidebarHeader />
      <SidebarItems />
    </aside>
  )
}
