/* eslint-disable @typescript-eslint/no-throw-literal */

import React, { useEffect, useState } from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IChangeLogVersion } from '@typedec/Changelog'
import LogItem from './components/LogItem'

function Changelog(): React.ReactElement {
  const [data] = useFetch<IChangeLogVersion[]>('change-log/list')
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
        title="Change Log"
        desc="All the changes made to this application will be listed here."
      />
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="features"
      />
      <APIComponentWithFallback data={data}>
        <ul className="relative isolate my-8 space-y-4">
          {typeof data !== 'string' &&
            (filteredData.length > 0 ? (
              filteredData.map(entry => (
                <LogItem key={entry.version} entry={entry} />
              ))
            ) : (
              <div className="flex-center flex h-full w-full">
                <EmptyStateScreen
                  title="Oops, no results found"
                  description="Your search query did not match any results."
                  icon="tabler:search-off"
                />
              </div>
            ))}
          <div className="absolute left-[calc(9rem+8px)] top-0 z-[-1] h-full -translate-x-1/2 border-r-2 border-bg-700" />
        </ul>
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Changelog
