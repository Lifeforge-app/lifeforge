import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { SearchInput } from 'lifeforge-ui'
import { useSidebarState } from 'shared'

function SidebarHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}) {
  const { sidebarExpanded, toggleSidebar } = useSidebarState()

  return (
    <>
      <div
        className={clsx(
          'flex-between flex h-24 w-full shrink-0 pl-6 transition-none',
          !sidebarExpanded && 'overflow-hidden'
        )}
      >
        <h1 className="ml-1 flex shrink-0 items-center gap-2 text-xl font-semibold whitespace-nowrap">
          <Icon className="text-custom-500 text-3xl" icon="tabler:hammer" />
          {sidebarExpanded && (
            <div>
              LifeForge<span className="text-custom-500 text-2xl">.</span>
            </div>
          )}
        </h1>
        {sidebarExpanded && (
          <button
            className="text-bg-500 hover:text-bg-800 dark:hover:text-bg-50 p-6 transition-all"
            onClick={toggleSidebar}
          >
            <Icon className="text-2xl" icon="tabler:menu" />
          </button>
        )}
      </div>
      {sidebarExpanded && (
        <div className="px-4">
          <SearchInput
            lighter
            className="mb-4"
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
