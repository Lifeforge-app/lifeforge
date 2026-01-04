import type { Route } from '@'
import { Icon } from '@iconify/react'
import {
  EmptyStateScreen,
  SidebarDivider,
  SidebarTitle,
  SidebarWrapper
} from 'lifeforge-ui'

function Sidebar({
  groupedEndpoints
}: {
  groupedEndpoints: Record<string, Route[]>
}) {
  return (
    <SidebarWrapper>
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
                            ? 'tabler:search'
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
            message={{
              id: 'search',
              namespace: 'apps.apiExplorer'
            }}
          />
        )}
      </div>
    </SidebarWrapper>
  )
}

export default Sidebar
