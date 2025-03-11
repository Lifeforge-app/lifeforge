import { useRailwayMapContext } from '@providers/RailwayMapProvider'
import clsx from 'clsx'
import React, { useMemo } from 'react'

import { EmptyStateScreen, Scrollbar, SearchInput } from '@lifeforge/ui'

import SearchResultItem from './components/SearchResultItem'

function SearchBar(): React.ReactElement {
  const { searchQuery, setSearchQuery, stations } = useRailwayMapContext()
  const searchResults = useMemo(() => {
    return stations
      .filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
  }, [searchQuery, stations])

  return (
    <div className="relative z-[500] w-full">
      <SearchInput
        hasTopMargin={false}
        namespace="modules.railwayMap"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="station"
      />
      {searchQuery.length > 0 && (
        <div
          className={clsx(
            'border-bg-800 bg-bg-50 shadow-custom dark:bg-bg-900 absolute z-50 mt-4 flex w-full flex-col rounded-md dark:border-2',
            typeof searchResults === 'string' && 'pt-6'
          )}
        >
          <Scrollbar autoHeight autoHeightMax={384} className="flex-1">
            <div className="divide-bg-200 dark:divide-bg-800 flex-1 divide-y">
              {searchResults.length > 0 ? (
                searchResults.map(station => (
                  <SearchResultItem key={station.id} station={station} />
                ))
              ) : (
                <div className="py-6">
                  <EmptyStateScreen
                    smaller
                    icon="tabler:search-off"
                    name="search"
                    namespace="modules.railwayMap"
                  />
                </div>
              )}
            </div>
          </Scrollbar>
        </div>
      )}
    </div>
  )
}

export default SearchBar
