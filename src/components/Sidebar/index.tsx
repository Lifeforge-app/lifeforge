import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import SidebarHeader from './components/SidebarHeader'
import SidebarItems from './components/SidebarItems'

function Sidebar(): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()

  return (
    <aside
      className={`${
        sidebarExpanded
          ? 'w-full sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 sm:w-[5.4rem]'
      } absolute left-0 top-0 z-[9990] flex h-full shrink-0 flex-col rounded-r-2xl bg-bg-50 shadow-custom duration-300 dark:bg-bg-900 lg:relative lg:dark:bg-bg-900`}
    >
      {sidebarExpanded && moment().format('MM-DD') === '08-31' && (
        <div className="flex-between flex w-full gap-2 whitespace-nowrap rounded-tr-2xl bg-custom-500 p-4 text-lg font-medium text-bg-800">
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:celebrate-line" className="text-2xl" />
            Happy Birthday, Malaysia!
          </div>
          <Icon
            icon="emojione-monotone:flag-for-malaysia"
            className="text-2xl"
          />
        </div>
      )}

      <SidebarHeader />
      <SidebarItems />
    </aside>
  )
}

export default Sidebar
