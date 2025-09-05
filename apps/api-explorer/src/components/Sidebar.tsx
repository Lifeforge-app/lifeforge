import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import {
  EmptyStateScreen,
  SSOHeader,
  SearchInput,
  SidebarDivider,
  SidebarTitle
} from 'lifeforge-ui'
import { useState } from 'react'

import { Route } from '../App'

function Sidebar({
  groupedEndpoints,
  searchQuery,
  setSearchQuery
}: {
  groupedEndpoints: Record<string, Route[]>
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  const [sidebarExpanded] = useState(true)

  return (
    <aside
      className={clsx(
        'bg-bg-50 shadow-custom dark:bg-bg-900 lg:bg-bg-50/50 lg:dark:bg-bg-900/50 absolute top-0 left-0 flex h-full shrink-0 flex-col overflow-hidden rounded-r-2xl backdrop-blur-xs transition-all duration-300 lg:relative lg:backdrop-blur-xs',
        sidebarExpanded
          ? 'w-full min-w-80 sm:w-1/2 lg:w-3/12 xl:w-1/5'
          : 'w-0 min-w-0 sm:w-[5.4rem]'
      )}
    >
      <SSOHeader
        className="p-6"
        icon="mynaui:api"
        link="https://github.com/Lifeforge-app/lifeforge/tree/main/apps/api-explorer"
        namespace="core.apiExplorer"
      />
      <div className="px-4">
        <SearchInput
          className="mb-4"
          namespace="core.apiExplorer"
          value={searchQuery}
          setValue={setSearchQuery}
          searchTarget="endpoints"
        />
      </div>
      <div className="mt-2 flex-1 space-y-3 overflow-y-auto">
        {Object.entries(groupedEndpoints).length ? (
          Object.entries(groupedEndpoints).map(([topLevelPath, endpoints]) => (
            <>
              <div key={topLevelPath} className="mb-6">
                <SidebarTitle label={`${topLevelPath} (${endpoints.length})`} />
                <div className="mt-2 space-y-3">
                  {endpoints.map(endpoint => (
                    <div
                      key={endpoint.path}
                      className="text-bg-500 flex w-full min-w-0 items-center gap-2 px-8"
                    >
                      <Icon
                        className="text-bg-500 size-6"
                        icon={
                          endpoint.method === 'GET'
                            ? 'tabler:database-search'
                            : 'tabler:pencil'
                        }
                      />
                      <code className="ml-2 w-full min-w-0 truncate">
                        {endpoint.path.split('/').slice(1).join('/') ||
                          '<ROOT>'}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
              <SidebarDivider />
            </>
          ))
        ) : (
          <EmptyStateScreen
            smaller
            icon="tabler:search-off"
            name="search"
            namespace="core.apiExplorer"
          />
        )}
      </div>
    </aside>
  )
}

export default Sidebar
