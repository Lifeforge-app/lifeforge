import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type IGuitarTabsSidebarData,
  type IGuitarTabsEntry
} from '@interfaces/guitar_tabs_interfaces'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Pagination from './components/PageNumber'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'

function GuitarTabs(): React.ReactElement {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [searchParams] = useSearchParams()

  const [entries, refreshEntries] = useFetch<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    `guitar-tabs/list?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&category=${searchParams.get('category') ?? 'all'}&starred=${
      searchParams.get('starred') ?? 'false'
    }&author=${searchParams.get('author') ?? 'all'}`
  )
  const [sidebarData, refreshSidebarData] = useFetch<IGuitarTabsSidebarData>(
    'guitar-tabs/sidebar-data'
  )
  const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false)
  const [existingEntry, setExistingEntry] = useState<IGuitarTabsEntry | null>(
    null
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [searchParams])

  return (
    <ModuleWrapper>
      <Header
        refreshEntries={refreshEntries}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
      />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar sidebarData={sidebarData} />
        <div className="flex w-full flex-col lg:ml-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            All Scores{' '}
            <span className="text-base text-bg-500">
              ({typeof entries !== 'string' ? entries.totalItems : 0})
            </span>
          </h1>
          <div className="flex gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="guitar tabs"
            />
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md bg-bg-50 p-2 shadow-custom dark:bg-bg-900">
                {['grid', 'list'].map(viewType => (
                  <button
                    key={viewType}
                    onClick={() => {
                      setView(viewType as 'grid' | 'list')
                    }}
                    className={`flex items-center gap-2 rounded-md p-2 transition-all ${
                      viewType === view
                        ? 'bg-bg-200/50 dark:bg-bg-800'
                        : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
                    }`}
                  >
                    <Icon
                      icon={
                        viewType === 'grid'
                          ? 'uil:apps'
                          : viewType === 'list'
                          ? 'uil:list-ul'
                          : ''
                      }
                      className="size-6"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <APIComponentWithFallback data={entries}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                {entries.totalItems > 0 ? (
                  view === 'grid' ? (
                    <GridView
                      entries={entries.items}
                      setExistingEntry={setExistingEntry}
                      setModifyEntryModalOpen={setModifyEntryModalOpen}
                    />
                  ) : (
                    <ListView
                      entries={entries.items}
                      setExistingEntry={setExistingEntry}
                      setModifyEntryModalOpen={setModifyEntryModalOpen}
                    />
                  )
                ) : debouncedSearchQuery.trim() === '' ? (
                  <EmptyStateScreen
                    title="Oops! No guitar tabs found!"
                    description="Try uploading some guitar tabs to get started!"
                    icon="tabler:music-off"
                  />
                ) : (
                  <EmptyStateScreen
                    title="No results found!"
                    description="Try searching for something else!"
                    icon="tabler:search-off"
                  />
                )}
                <Pagination entries={entries} setPage={setPage} />
              </Scrollbar>
            )}
          </APIComponentWithFallback>
        </div>
      </div>
      <ModifyEntryModal
        isOpen={modifyEntryModalOpen}
        onClose={() => {
          setModifyEntryModalOpen(false)
          setExistingEntry(null)
        }}
        existingItem={existingEntry}
        refreshEntries={() => {
          refreshEntries()
          refreshSidebarData()
        }}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
