import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { SearchInput } from '@components/inputs'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'

function SidebarHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const { sidebarExpanded, toggleSidebar } = useGlobalStateContext()

  return (
    <>
      <div
        className={clsx(
          'flex-between flex h-24 w-full shrink-0 pl-6 transition-none',
          !sidebarExpanded && 'overflow-hidden'
        )}
      >
        <h1 className="ml-1 flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-semibold">
          <Icon className="text-3xl text-custom-500" icon="tabler:hammer" />
          {sidebarExpanded && (
            <div>
              LifeForge<span className="text-2xl text-custom-500">.</span>
            </div>
          )}
        </h1>
        {sidebarExpanded && (
          <button
            className="p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-50"
            onClick={toggleSidebar}
          >
            <Icon className="text-2xl" icon="tabler:menu" />
          </button>
        )}
      </div>
      {sidebarExpanded && (
        <div className="px-4">
          <SearchInput
            className="mb-4"
            hasTopMargin={false}
            namespace="common.sidebar"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="module"
          />
        </div>
      )}
    </>
  )
}

export default SidebarHeader
