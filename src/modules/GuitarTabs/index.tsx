import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  SearchInput
} from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import ViewModeSelector from '@components/utilities/ViewModeSelector'
import useFetch from '@hooks/useFetch'
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
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function GuitarTabs(): React.ReactElement {
  const { t } = useTranslation('modules.guitarTabs')
  const { componentBgWithHover } = useThemeColors()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [searchParams, setSearchParams] = useSearchParams()

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
            icon="tabler:music-off"
            name="score"
            namespace="modules.guitarTabs"
          />
        )
      }

      return (
        <EmptyStateScreen
          icon="tabler:search-off"
          name="result"
          namespace="modules.guitarTabs"
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
            setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
            setExistingEntry={setExistingEntry}
            setModifyEntryModalOpen={setModifyEntryModalOpen}
          />
        )
      case 'list':
        return (
          <ListView
            entries={entries.items}
            setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
            setExistingEntry={setExistingEntry}
            setModifyEntryModalOpen={setModifyEntryModalOpen}
          />
        )
    }
  }

  return (
    <ModuleWrapper>
      <Header
        refreshEntries={refreshEntries}
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        setView={setView}
        totalItems={typeof entries !== 'string' ? entries.totalItems : 0}
        view={view}
      />
      <SidebarAndContentWrapper>
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          sidebarData={sidebarData}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                {`${
                  searchParams.get('starred') === 'true'
                    ? t('headers.starred')
                    : ''
                } ${
                  searchParams.get('category') !== null
                    ? t(`headers.${searchParams.get('category')}`)
                    : ''
                } ${
                  searchParams.get('category') === null &&
                  searchParams.get('author') === null &&
                  searchParams.get('starred') === null
                    ? t('headers.all')
                    : ''
                } ${t('items.score')} ${
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
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
              onClick={() => {
                setSidebarOpen(true)
              }}
            >
              <Icon className="text-2xl" icon="tabler:menu" />
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
                    className="size-6"
                    icon={
                      SORT_TYPE.find(
                        ([, , value]) => value === searchParams.get('sort')
                      )?.[1] ?? 'tabler:clock'
                    }
                  />
                  <span className="whitespace-nowrap font-medium">
                    {t(
                      `sortTypes.${
                        SORT_TYPE.find(
                          ([, , value]) => value === searchParams.get('sort')
                        )?.[1] ?? 'newest'
                      }`
                    )}
                  </span>
                </div>
                <Icon
                  className="size-5 text-bg-500"
                  icon="tabler:chevron-down"
                />
              </ListboxButton>
              <ListboxOrComboboxOptions>
                {SORT_TYPE.map(([icon, value]) => (
                  <ListboxOrComboboxOption
                    key={value}
                    icon={icon}
                    text={t(`sortTypes.${value}`)}
                    value={value}
                  />
                ))}
              </ListboxOrComboboxOptions>
            </Listbox>
            <SearchInput
              namespace="modules.guitarTabs"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="score"
            />
            <ViewModeSelector
              className="hidden md:flex"
              options={[
                { value: 'list', icon: 'uil:list-ul' },
                { value: 'grid', icon: 'uil:apps' }
              ]}
              setViewMode={setView}
              viewMode={view}
            />
          </div>
          <APIFallbackComponent data={entries}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <Pagination
                  className="mb-4"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={setPage}
                />
                {renderContent(entries)}
                <Pagination
                  className="mt-4 pb-12"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={setPage}
                />
              </Scrollbar>
            )}
          </APIFallbackComponent>
        </ContentWrapperWithSidebar>
      </SidebarAndContentWrapper>
      <ModifyEntryModal
        existingItem={existingEntry}
        isOpen={modifyEntryModalOpen}
        refreshEntries={() => {
          refreshEntries()
          refreshSidebarData()
        }}
        onClose={() => {
          setModifyEntryModalOpen(false)
          setExistingEntry(null)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="guitar-tabs/entries"
        data={existingEntry}
        isOpen={deleteConfirmationModalOpen}
        itemName="guitar tab"
        nameKey="title"
        updateDataLists={() => {
          refreshEntries()
          refreshSidebarData()
        }}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
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
