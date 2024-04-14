/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '@components/ModuleHeader'
import useFetch from '@hooks/useFetch'
import LogItem from './components/LogItem'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import ModuleWrapper from '@components/ModuleWrapper'
import EmptyStateScreen from '@components/EmptyStateScreen'
import SearchInput from '@components/SearchInput'

export interface IChangeLogVersion {
  version: string
  date_range: [string, string]
  entries: IChangeLogEntry[]
}

interface IChangeLogEntry {
  id: string
  feature: string
  description: string
}

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
        <ul className="my-8 space-y-4">
          {typeof data !== 'string' &&
            (filteredData.length > 0 ? (
              filteredData.map(entry => (
                <LogItem key={entry.version} entry={entry} />
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <EmptyStateScreen
                  title="Oops, no results found"
                  description="Your search query did not match any results."
                  icon="tabler:search-off"
                />
              </div>
            ))}
        </ul>
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Changelog
