import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Pagination from './components/PageNumber'
import GridView from './views/GridView'
import ListView from './views/ListView'

function GuitarTabs(): React.ReactElement {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [entries, refreshEntries, setEntries] = useFetch<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    `guitar-tabs/list?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}`
  )
  const [modifyEntryModalOpen, setModifyEntryModalOpen] =
    useState<boolean>(false)
  const [existingEntry, setExistingEntry] = useState<IGuitarTabsEntry | null>(
    null
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  return (
    <ModuleWrapper>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setView={setView}
        view={view}
        refreshEntries={refreshEntries}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
      />
      <APIComponentWithFallback data={entries}>
        {entries => (
          <>
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
          </>
        )}
      </APIComponentWithFallback>
      <ModifyEntryModal
        isOpen={modifyEntryModalOpen}
        onClose={() => {
          setModifyEntryModalOpen(false)
          setExistingEntry(null)
        }}
        existingItem={existingEntry}
        setEntries={setEntries}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
