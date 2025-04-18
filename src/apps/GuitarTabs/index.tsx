import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  Button,
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  LayoutWithSidebar,
  ModuleWrapper,
  Pagination,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import GuitarWorldModal from './components/GuitarWorldModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from './interfaces/guitar_tabs_interfaces'
import Views from './views'

function GuitarTabs() {
  const { t } = useTranslation('apps.guitarTabs')
  const queryClient = useQueryClient()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [searchParams] = useSearchParams()
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
  const queryKey = [
    'guitar-tabs',
    'entries',
    page,
    debouncedSearchQuery,
    category,
    starred,
    author,
    sort
  ]

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

  return (
    <ModuleWrapper>
      <Header
        queryKey={queryKey}
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        setView={setView}
        totalItems={entriesQuery.data?.totalItems}
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
              <span className="text-bg-500 mr-8 ml-2 text-base">
                ({entriesQuery.data?.totalItems ?? 0})
              </span>
            </div>

            <Button
              className="lg:hidden"
              icon="tabler:menu"
              variant="plain"
              onClick={() => {
                setSidebarOpen(true)
              }}
            />
          </header>
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setView={setView}
            view={view}
          />
          <QueryWrapper query={entriesQuery}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <Pagination
                  className="mb-4"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={setPage}
                />
                <Views
                  debouncedSearchQuery={debouncedSearchQuery}
                  entries={entries.items}
                  queryKey={queryKey}
                  setDeleteConfirmationModalOpen={
                    setDeleteConfirmationModalOpen
                  }
                  setExistingEntry={setExistingEntry}
                  setModifyEntryModalOpen={setModifyEntryModalOpen}
                  totalItems={entries.totalItems}
                  view={view}
                />
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
        data={existingEntry ?? undefined}
        isOpen={deleteConfirmationModalOpen}
        itemName="guitar tab"
        nameKey="title"
        queryKey={queryKey}
        queryUpdateType="invalidate"
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
