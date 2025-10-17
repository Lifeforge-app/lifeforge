import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { WithQuery } from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { InferOutput } from 'shared'

import Sidebar from './components/Sidebar'
import forgeAPI from './utils/forgeAPI'

export type Route = InferOutput<typeof forgeAPI._listRoutes>[number]

function App() {
  const endpointsQuery = useQuery(forgeAPI._listRoutes.queryOptions())

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
    <div className="flex h-full w-full flex-1">
      <WithQuery query={endpointsQuery}>
        {data => (
          <>
            <Sidebar
              groupedEndpoints={groupedEndpoints}
              value={searchQuery}
              setValue={setSearchQuery}
            />
            <div className="flex-1 overflow-y-auto p-12">
              <div className="space-y-3">
                {data.map(endpoint => (
                  <div
                    key={endpoint.path}
                    className={
                      'flex-between shadow-custom component-bg-with-hover gap-6 rounded-md p-4 text-lg'
                    }
                  >
                    <div className="flex items-center gap-6">
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
                          className="text-bg-500 size-6"
                          icon={
                            endpoint.method === 'GET'
                              ? 'tabler:database-search'
                              : 'tabler:pencil'
                          }
                        />
                        <code>
                          {endpoint.path.split('/').slice(0, -1).join('/')}
                          <span className="text-custom-500">
                            /{endpoint.path.split('/').slice(-1)}
                          </span>
                        </code>
                      </div>
                      <p className="text-base">{endpoint.description}</p>
                    </div>
                    <Icon
                      className="text-bg-400 dark:text-bg-600 mr-2 size-5"
                      icon="tabler:chevron-down"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </WithQuery>
    </div>
  )
}

export default App
