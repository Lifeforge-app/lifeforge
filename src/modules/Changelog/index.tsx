import React, { useEffect, useState } from 'react'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  MenuItem,
  SearchInput
} from '@lifeforge/ui'
import { ModuleWrapper } from '@lifeforge/ui'
import { ModuleHeader } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import LogItem from './components/LogItem'
import { type IChangeLogVersion } from './interfaces/changelog_interfaces'

function Changelog(): React.ReactElement {
  const [data, refreshData] = useFetch<IChangeLogVersion[]>('change-log')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<IChangeLogVersion[]>([])

  useEffect(() => {
    if (typeof data !== 'string') {
      if (searchQuery.length === 0) {
        setFilteredData(data)
      } else {
        setFilteredData(
          data
            .filter(entry =>
              entry.entries.some(entry =>
                entry.feature.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .map(entry => {
              return {
                ...entry,
                entries: entry.entries.filter(entry =>
                  entry.feature
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              }
            })
        )
      }
    }
  }, [data, searchQuery])

  return (
    <ModuleWrapper>
      <ModuleHeader
        hamburgerMenuItems={
          <MenuItem
            icon="tabler:refresh"
            text="Refresh"
            onClick={refreshData}
          />
        }
        icon="tabler:history"
        title="Change Log"
      />
      <SearchInput
        namespace="modules.changelog"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="feature"
      />
      <APIFallbackComponent data={data}>
        {() => (
          <ul className="relative isolate my-8 flex-1 space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map(entry => (
                <LogItem key={entry.version} entry={entry} />
              ))
            ) : (
              <div className="flex-center size-full">
                <EmptyStateScreen
                  icon="tabler:search-off"
                  name="result"
                  namespace="modules.changelog"
                />
              </div>
            )}
            <div className="border-bg-200 dark:border-bg-700 absolute left-[calc(9rem+8px)] top-0 z-[-1] hidden h-full -translate-x-1/2 border-r-2 sm:block" />
          </ul>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Changelog
