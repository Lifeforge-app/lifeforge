/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import useFetch from '../../hooks/useFetch'
import LogItem from './components/LogItem'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import ModuleWrapper from '../../components/general/ModuleWrapper'
import { Icon } from '@iconify/react/dist/iconify.js'
import EmptyStateScreen from '../../components/general/EmptyStateScreen'

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
      <search className="mt-6 flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
        <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
          }}
          placeholder="Search idea containers ..."
          className="w-full bg-transparent placeholder:text-bg-400 focus:outline-none"
        />
      </search>
      <APIComponentWithFallback data={data}>
        <ul className="my-8 flex flex-1 flex-col gap-4">
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
