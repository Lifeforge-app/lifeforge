import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  Button,
  Card,
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  SearchInput,
  WithQuery,
  useModuleSidebarState
} from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { type InferOutput, usePersonalization } from 'shared'

import Sidebar from './components/Sidebar'
import forgeAPI from './utils/forgeAPI'

export type Route = InferOutput<typeof forgeAPI.listRoutes>[number]

function APIEndpointExplorer() {
  const { language } = usePersonalization()

  const endpointsQuery = useQuery(forgeAPI.listRoutes.queryOptions())

  const { setIsSidebarOpen } = useModuleSidebarState()

  const [searchQuery, setSearchQuery] = useState('')

  const groupedEndpoints = useMemo(() => {
    if (!endpointsQuery.data) return {}

    return Object.fromEntries(
      Object.entries(
        endpointsQuery.data.reduce(
          (acc, endpoint) => {
            if (
              !endpoint.path.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return acc
            }

            const topLevelPath = endpoint.path.split('/')[0] || 'root'

            if (!acc[topLevelPath]) {
              acc[topLevelPath] = []
            }
            acc[topLevelPath].push(endpoint)

            return acc
          },
          {} as Record<string, Route[]>
        )
      ).filter(([_, endpoints]) => endpoints.length > 0)
    )
  }, [endpointsQuery.data, searchQuery])

  return (
    <>
      <ModuleHeader />
      <LayoutWithSidebar>
        <Sidebar groupedEndpoints={groupedEndpoints} />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-2xl font-semibold xl:text-3xl">
                All Endpoints
              </h1>
              <span className="text-bg-500 mr-8 ml-2 text-base">
                ({endpointsQuery.data?.length || 0})
              </span>
            </div>
            <Button
              className="lg:hidden"
              icon="tabler:menu"
              variant="plain"
              onClick={() => {
                setIsSidebarOpen(true)
              }}
            />
          </header>
          <SearchInput
            className="my-6"
            namespace="apps.apiExplorer"
            searchTarget="endpoints"
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <WithQuery query={endpointsQuery}>
            {data => (
              <Scrollbar>
                <div className="space-y-3 pb-8">
                  {data.map(endpoint => (
                    <Card key={endpoint.path} className="flex-between gap-6">
                      <div className="text-bg-500 flex items-center gap-3">
                        <div
                          className={clsx(
                            'h-7 w-1 rounded-full',
                            endpoint.method === 'GET'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          )}
                        />
                        <Icon
                          className="text-bg-500 size-5"
                          icon={
                            endpoint.method === 'GET'
                              ? 'tabler:search'
                              : 'tabler:pencil'
                          }
                        />
                        <code className="whitespace-nowrap">
                          {endpoint.path.split('/').slice(0, -1).join('/')}
                          <span className="text-custom-500">
                            /{endpoint.path.split('/').slice(-1)}
                          </span>
                        </code>
                      </div>
                      <p className="text-bg-500 text-right text-base">
                        {typeof endpoint.description === 'string'
                          ? endpoint.description
                          : endpoint.description[
                              language as keyof typeof endpoint.description
                            ] || ''}
                      </p>
                      {/* <Icon
                        className="text-bg-400 dark:text-bg-600 mr-2 size-5"
                        icon="tabler:chevron-down"
                      /> */}
                    </Card>
                  ))}
                </div>
              </Scrollbar>
            )}
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default APIEndpointExplorer
