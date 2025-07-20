import clsx from 'clsx'
import {
  EmptyStateScreen,
  SearchInput,
  SidebarDivider,
  SidebarTitle
} from 'lifeforge-ui'
import { useState } from 'react'

import { RouteCustomSchemas } from 'shared/types/collections'

import Header from '../../components/Header'
import METHOD_COLORS from '../../constants/methodColors'

function Sidebar({
  groupedEndpoints,
  searchQuery,
  setSearchQuery
}: {
  groupedEndpoints: Record<string, RouteCustomSchemas.IRoute[]>
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
      <Header />
      <div className="px-4">
        <SearchInput
          className="mb-4"
          namespace="core.apiExplorer"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="endpoints"
        />
      </div>
      <div className="mt-2 flex-1 space-y-4 overflow-y-auto">
        {Object.entries(groupedEndpoints).length ? (
          Object.entries(groupedEndpoints).map(([topLevelPath, endpoints]) => (
            <>
              <div key={topLevelPath} className="mb-6">
                <SidebarTitle name={`${topLevelPath} (${endpoints.length})`} />
                <div className="mt-2 space-y-4">
                  {endpoints.map(endpoint => (
                    <p
                      key={endpoint.path}
                      className="text-bg-500 w-full min-w-0 gap-4 truncate px-8"
                    >
                      <span
                        className={clsx(
                          'font-semibold tracking-wider',
                          METHOD_COLORS[endpoint.method].color ||
                            'text-gray-500'
                        )}
                      >
                        {endpoint.method}
                      </span>
                      <code className="ml-2 w-full min-w-0">
                        {endpoint.path}
                      </code>
                    </p>
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
