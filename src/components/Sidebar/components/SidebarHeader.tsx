import { Icon } from '@iconify/react'
import React from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'

function SidebarHeader(): React.ReactElement {
  const { sidebarExpanded, toggleSidebar } = useGlobalStateContext()

  return (
    <div
      className={`flex h-24 w-full shrink-0 flex-between pl-6 transition-none ${
        !sidebarExpanded ? 'overflow-hidden' : ''
      }`}
    >
      <h1 className="ml-1 flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-semibold ">
        <Icon icon="tabler:hammer" className="text-3xl text-custom-500" />
        {sidebarExpanded && (
          <div>
            LifeForge<span className="text-2xl text-custom-500"> .</span>
          </div>
        )}
      </h1>
      {sidebarExpanded && (
        <button
          onClick={toggleSidebar}
          className="p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-100"
        >
          <Icon icon="tabler:menu" className="text-2xl" />
        </button>
      )}
    </div>
  )
}

export default SidebarHeader
