import { Icon } from '@iconify/react'
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
        className={`flex-between flex h-24 w-full shrink-0 pl-6 transition-none ${
          !sidebarExpanded ? 'overflow-hidden' : ''
        }`}
      >
        <h1 className="ml-1 flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-semibold">
          <Icon icon="tabler:hammer" className="text-3xl text-custom-500" />
          {sidebarExpanded && (
            <div>
              LifeForge<span className="text-2xl text-custom-500">.</span>
            </div>
          )}
        </h1>
        {sidebarExpanded && (
          <button
            onClick={toggleSidebar}
            className="p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-50"
          >
            <Icon icon="tabler:menu" className="text-2xl" />
          </button>
        )}
      </div>
      {sidebarExpanded && (
        <div className="px-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="modules"
            hasTopMargin={false}
            className="mb-4 !bg-bg-200/70"
          />
        </div>
      )}
    </>
  )
}

export default SidebarHeader
