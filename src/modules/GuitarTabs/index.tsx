import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import ListboxOrComboboxOptions from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOptions'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import ViewModeSelector from '@components/Miscellaneous/ViewModeSelector'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import useThemeColors from '@hooks/useThemeColor'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from '@interfaces/guitar_tabs_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import GuitarWorldModal from './components/GuitarWorldModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Sidebar from './components/Sidebar'
import GridView from './views/GridView'
import ListView from './views/ListView'
import Pagination from '../../components/Miscellaneous/Pagination'

const SORT_TYPE = [
  ['Newest', 'tabler:clock', 'newest'],
  ['Oldest', 'tabler:clock', 'oldest'],
  ['Author', 'tabler:at', 'author'],
  ['Title', 'tabler:abc', 'name']
]

function GuitarTabs(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [searchParams, setSearchParams] = useHashParams()

  const [entries, refreshEntries] = useFetch<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    `guitar-tabs/entries?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&category=${searchParams.get('category') ?? 'all'}&starred=${
      searchParams.get('starred') ?? 'false'
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

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [setSubSidebarExpanded, sidebarOpen])

  return (
    <ModuleWrapper>
      <Header
        refreshEntries={refreshEntries}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
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
          <div className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
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
              <span className="mb-2 ml-1 mr-8 text-base text-bg-500">
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
          </div>
          <div className="flex gap-2">
            <Listbox
              as="div"
              className="relative"
              value={searchParams.get('sort') ?? 'newest'}
              onChange={value => {
                setSearchParams({ sort: value })
              }}
            >
              <ListboxButton
                className={`flex-between mt-4 flex w-48 gap-2 rounded-md p-4 shadow-custom ${componentBgWithHover}`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon={
                      SORT_TYPE.find(
                        ([_, __, value]) => value === searchParams.get('sort')
                      )?.[1] ?? 'tabler:clock'
                    }
                    className="size-6"
                  />
                  <span className="whitespace-nowrap font-medium">
                    {SORT_TYPE.find(
                      ([_, __, value]) => value === searchParams.get('sort')
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
              viewMode={view}
              setViewMode={setView}
              options={[
                { value: 'list', icon: 'uil:list-ul' },
                { value: 'grid', icon: 'uil:apps' }
              ]}
            />
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
                <Pagination
                  currentPage={entries.page}
                  onPageChange={setPage}
                  totalPages={entries.totalPages}
                  className="mt-4 pb-12"
                />
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
        apiEndpoint="guitar-tabs/entries"
        data={existingEntry}
        nameKey="title"
        itemName="guitar tab"
        updateDataList={() => {
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
