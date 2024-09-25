import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from '@interfaces/guitar_tabs_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Pagination from './components/PageNumber'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'

function GuitarTabs(): React.ReactElement {
  const { setSubSidebarExpanded } = useGlobalStateContext()
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
    `guitar-tabs?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&category=${searchParams.get('category') ?? 'all'}&starred=${
      searchParams.get('starred') ?? 'false'
    }&author=${searchParams.get('author') ?? 'all'}`
  )
  const [sidebarData, refreshSidebarData] = useFetch<IGuitarTabsSidebarData>(
    'guitar-tabs/sidebar-data'
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false)
  const [existingEntry, setExistingEntry] = useState<IGuitarTabsEntry | null>(
    null
  )
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [setSubSidebarExpanded, sidebarOpen])

  return (
    <ModuleWrapper>
      <Header
        refreshEntries={refreshEntries}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
      />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar
          sidebarData={sidebarData}
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <div className="flex w-full flex-col lg:ml-8">
          <div className="flex w-full items-end">
            <h1 className="truncate pb-1 text-3xl font-semibold sm:text-4xl">
              {`${searchParams.get('starred') === 'true' ? 'Starred ' : ''} ${
                searchParams.get('category') !== null
                  ? {
                      fingerstyle: 'Fingerstyle',
                      singalong: 'Singalong',
                      uncategorized: 'Uncategorized'
                    }[
                      searchParams.get('category') as
                        | 'fingerstyle'
                        | 'singalong'
                    ]
                  : ''
              } ${
                searchParams.get('category') === null &&
                searchParams.get('author') === null &&
                searchParams.get('starred') === null
                  ? 'All'
                  : ''
              } Guitar Tabs ${
                searchParams.get('author') !== null
                  ? `by ${searchParams.get('author')}`
                  : ''
              }`.trim()}
            </h1>
            <span className="ml-2 mr-8 text-base text-bg-500">
              ({typeof entries !== 'string' ? entries.totalItems : 0})
            </span>
            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          </div>
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
                        : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
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
                      setDeleteConfirmationModalOpen={
                        setDeleteConfirmationModalOpen
                      }
                    />
                  ) : (
                    <ListView
                      entries={entries.items}
                      setExistingEntry={setExistingEntry}
                      setModifyEntryModalOpen={setModifyEntryModalOpen}
                      setDeleteConfirmationModalOpen={
                        setDeleteConfirmationModalOpen
                      }
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
      <DeleteConfirmationModal
        isOpen={deleteConfirmationModalOpen}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
        apiEndpoint="guitar-tabs"
        data={existingEntry}
        nameKey="title"
        itemName="guitar tab"
        updateDataList={() => {
          refreshEntries()
          refreshSidebarData()
        }}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
