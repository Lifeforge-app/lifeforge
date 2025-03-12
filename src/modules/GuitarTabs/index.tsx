import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  EmptyStateScreen,
  LayoutWithSidebar,
  ListboxOrComboboxOption,
  ListboxOrComboboxOptions,
  ModuleWrapper,
  Pagination,
  QueryWrapper,
  Scrollbar,
  SearchInput,
  ViewModeSelector
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'
import useComponentBg from '@hooks/useComponentBg'

import GuitarWorldModal from './components/GuitarWorldModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Sidebar from './components/Sidebar'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from './interfaces/guitar_tabs_interfaces'
import GridView from './views/GridView'
import ListView from './views/ListView'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function GuitarTabs() {
  const { t } = useTranslation('modules.guitarTabs')
  const { componentBgWithHover } = useComponentBg()
  const queryClient = useQueryClient()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [searchParams, setSearchParams] = useSearchParams()
  const category = useMemo(
    () => searchParams.get('category') ?? 'all',
    [searchParams]
  )
  const author = useMemo(() => searchParams.get('author') ?? '', [searchParams])
  const starred = useMemo(
    () => searchParams.get('starred') === 'true',
    [searchParams]
  )
  const sort = useMemo(
    () => searchParams.get('sort') ?? 'newest',
    [searchParams]
  )
  const queryKey = useMemo(
    () => [
      'guitar-tabs',
      'entries',
      page,
      debouncedSearchQuery,
      category,
      starred,
      author,
      sort
    ],
    [page, debouncedSearchQuery, category, starred, author, sort]
  )

  const entriesQuery = useAPIQuery<{
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
    }`,
    queryKey
  )
  const sidebarDataQuery = useAPIQuery<IGuitarTabsSidebarData>(
    'guitar-tabs/entries/sidebar-data',
    ['guitar-tabs', 'sidebar-data']
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
            queryKey={queryKey}
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
        queryKey={queryKey}
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        setView={setView}
        totalItems={entriesQuery.data?.totalItems ?? 0}
        view={view}
      />
      <LayoutWithSidebar>
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          sidebarDataQuery={sidebarDataQuery}
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
              <span className="text-bg-500 ml-2 mr-8 text-base">
                ({entriesQuery.data?.totalItems ?? 0})
              </span>
            </div>

            <button
              className="text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 -ml-4 rounded-lg p-4 transition-all lg:hidden"
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
                className={clsx(
                  'flex-between shadow-custom mt-4 flex w-48 gap-2 rounded-md p-4',
                  componentBgWithHover
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className="size-6"
                    icon={
                      SORT_TYPE.find(
                        ([, value]) => value === searchParams.get('sort')
                      )?.[0] ?? 'tabler:clock'
                    }
                  />
                  <span className="whitespace-nowrap font-medium">
                    {t(
                      `sortTypes.${
                        SORT_TYPE.find(
                          ([, value]) => value === searchParams.get('sort')
                        )?.[1] ?? 'newest'
                      }`
                    )}
                  </span>
                </div>
                <Icon
                  className="text-bg-500 size-5"
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
          <QueryWrapper query={entriesQuery}>
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
          </QueryWrapper>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <ModifyEntryModal
        existingItem={existingEntry}
        isOpen={modifyEntryModalOpen}
        queryKey={queryKey}
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
        queryKey={queryKey}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
      />
      <GuitarWorldModal
        isOpen={guitarWorldModalOpen}
        onClose={() => {
          queryClient.invalidateQueries({ queryKey })
          queryClient.invalidateQueries({
            queryKey: ['guitar-tabs', 'sidebar-data']
          })
          setGuitarWorldModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
