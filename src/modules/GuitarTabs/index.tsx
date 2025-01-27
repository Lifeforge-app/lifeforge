import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  SearchInput
} from '@components/inputs'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import ViewModeSelector from '@components/utilities/ViewModeSelector'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import useThemeColors from '@hooks/useThemeColor'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from '@interfaces/guitar_tabs_interfaces'
import GuitarWorldModal from './components/GuitarWorldModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'
import Pagination from '../../components/utilities/Pagination'

const SORT_TYPE = [
  ['Newest', 'tabler:clock', 'newest'],
  ['Oldest', 'tabler:clock', 'oldest'],
  ['Author', 'tabler:at', 'author'],
  ['Title', 'tabler:abc', 'name']
]

function GuitarTabs(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [searchParams, setSearchParams] = useHashParams()

  const [entries, refreshEntries] = useFetch<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    `guitar-tabs/entries?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&category=${searchParams.get('category') ?? 'all'}${
      searchParams.get('starred') !== null ? '&starred=true' : ''
    }&author=${searchParams.get('author') ?? 'all'}&sort=${
      searchParams.get('sort') ?? 'newest'
    }`
  )
  const [sidebarData, refreshSidebarData] = useFetch<IGuitarTabsSidebarData>(
    'guitar-tabs/entries/sidebar-data'
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false)
  const [existingEntry, setExistingEntry] = useState<IGuitarTabsEntry | null>(
    null
  )
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [guitarWorldModalOpen, setGuitarWorldModalOpen] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [searchParams])

  const renderContent = (entries: {
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }) => {
    if (entries.totalItems === 0) {
      if (debouncedSearchQuery.trim() === '') {
        return (
          <EmptyStateScreen
            title="Oops! No guitar tabs found!"
            description="Try uploading some guitar tabs to get started!"
            icon="tabler:music-off"
          />
        )
      }

      return (
        <EmptyStateScreen
          title="No results found!"
          description="Try searching for something else!"
          icon="tabler:search-off"
        />
      )
    }

    switch (view) {
      case 'grid':
        return (
          <GridView
            entries={entries.items}
            refreshEntries={() => {
              refreshEntries()
              refreshSidebarData()
            }}
            setExistingEntry={setExistingEntry}
            setModifyEntryModalOpen={setModifyEntryModalOpen}
            setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          />
        )
      case 'list':
        return (
          <ListView
            entries={entries.items}
            setExistingEntry={setExistingEntry}
            setModifyEntryModalOpen={setModifyEntryModalOpen}
            setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          />
        )
    }
  }

  return (
    <ModuleWrapper>
      <Header
        refreshEntries={refreshEntries}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        view={view}
        setView={setView}
      />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar
          sidebarData={sidebarData}
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
        <div className="flex w-full flex-col lg:ml-8">
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
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
            </div>

            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          </header>
          <div className="flex gap-2">
            <Listbox
              as="div"
              className="relative hidden md:block"
              value={searchParams.get('sort') ?? 'newest'}
              onChange={value => {
                searchParams.set('sort', value)
                setSearchParams(searchParams)
              }}
            >
              <ListboxButton
                className={`flex-between mt-4 flex w-48 gap-2 rounded-md p-4 shadow-custom ${componentBgWithHover}`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={
                      SORT_TYPE.find(
                        ([, , value]) => value === searchParams.get('sort')
                      )?.[1] ?? 'tabler:clock'
                    }
                    className="size-6"
                  />
                  <span className="whitespace-nowrap font-medium">
                    {SORT_TYPE.find(
                      ([, , value]) => value === searchParams.get('sort')
                    )?.[0] ?? 'Newest'}
                  </span>
                </div>
                <Icon
                  icon="tabler:chevron-down"
                  className="size-5 text-bg-500"
                />
              </ListboxButton>
              <ListboxOrComboboxOptions>
                {SORT_TYPE.map(([name, icon, value]) => (
                  <ListboxOrComboboxOption
                    key={value}
                    value={value}
                    icon={icon}
                    text={name}
                  />
                ))}
              </ListboxOrComboboxOptions>
            </Listbox>
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="guitar tabs"
            />
            <ViewModeSelector
              className="hidden md:flex"
              viewMode={view}
              setViewMode={setView}
              options={[
                { value: 'list', icon: 'uil:list-ul' },
                { value: 'grid', icon: 'uil:apps' }
              ]}
            />
          </div>
          <APIFallbackComponent data={entries}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <Pagination
                  currentPage={entries.page}
                  onPageChange={setPage}
                  totalPages={entries.totalPages}
                  className="mb-4"
                />
                {renderContent(entries)}
                <Pagination
                  currentPage={entries.page}
                  onPageChange={setPage}
                  totalPages={entries.totalPages}
                  className="mt-4 pb-12"
                />
              </Scrollbar>
            )}
          </APIFallbackComponent>
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
        apiEndpoint="guitar-tabs/entries"
        data={existingEntry}
        nameKey="title"
        itemName="guitar tab"
        updateDataLists={() => {
          refreshEntries()
          refreshSidebarData()
        }}
      />
      <GuitarWorldModal
        isOpen={guitarWorldModalOpen}
        onClose={() => {
          refreshEntries()
          refreshSidebarData()
          setGuitarWorldModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
