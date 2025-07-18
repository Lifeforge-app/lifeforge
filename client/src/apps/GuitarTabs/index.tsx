import { ISocketEvent, useSocketContext } from '@providers/SocketProvider'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  ModuleWrapper,
  Pagination,
  QueryWrapper,
  Scrollbar
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Id, toast } from 'react-toastify'

import { useAPIQuery } from 'shared/lib'
import { fetchAPI } from 'shared/lib'

import Header from './components/Header'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import GuitarWorldModal from './components/modals/GuitarWorldModal'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from './interfaces/guitar_tabs_interfaces'
import Views from './views'

function GuitarTabs() {
  const { t } = useTranslation('apps.guitarTabs')

  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [page, setPage] = useState<number>(1)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  const [isStarred, setStarred] = useState<boolean>(false)

  const [selectedSortType, setSelectedSortType] = useState<string>('newest')

  const queryKey = [
    'guitar-tabs',
    'entries',
    page,
    debouncedSearchQuery,
    selectedCategory,
    isStarred,
    selectedAuthor,
    selectedSortType
  ]

  const entriesQuery = useAPIQuery<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    (() => {
      const searchParams = new URLSearchParams()

      searchParams.set('sort', selectedSortType)
      searchParams.set('page', String(page))

      if (debouncedSearchQuery.trim())
        searchParams.set('query', debouncedSearchQuery.trim())

      if (selectedCategory) searchParams.set('category', selectedCategory)

      if (isStarred) searchParams.set('starred', 'true')

      if (selectedAuthor) searchParams.set('author', selectedAuthor)

      return `guitar-tabs/entries?${searchParams.toString()}`
    })(),
    queryKey
  )

  const sidebarDataQuery = useAPIQuery<IGuitarTabsSidebarData>(
    'guitar-tabs/entries/sidebar-data',
    ['guitar-tabs', 'sidebar-data']
  )

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const open = useModalStore(state => state.open)

  const socket = useSocketContext()

  const queryClient = useQueryClient()

  const toastId = useRef<Id>(null)

  const uploadFiles = useCallback(async () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.mp3,.mscz'

    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      const formData = new FormData()

      if (files === null) {
        return
      }

      if (files.length > 100) {
        toast.error('You can only upload 100 files at a time!')

        return
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], encodeURIComponent(files[i].name))
      }

      try {
        const taskId = await fetchAPI<string>(
          import.meta.env.VITE_API_HOST,
          `guitar-tabs/entries/upload`,
          {
            method: 'POST',
            body: formData
          }
        )

        socket.on(
          'taskPoolUpdate',
          (
            data: ISocketEvent<
              undefined,
              {
                left: number
                total: number
              }
            >
          ) => {
            console.log(data.status)
            if (!data || data.taskId !== taskId) return

            if (data.status === 'failed') {
              toastId.current = null
              toast.error('Failed to upload guitar tabs!')

              return
            }

            if (data.status === 'running') {
              if (toastId.current === null) {
                toastId.current = toast('Upload in Progress', {
                  progress: 0,
                  autoClose: false
                })
              }

              toast.update(toastId.current, {
                progress:
                  (data.progress!.total - data.progress!.left) /
                  data.progress!.total
              })
            }

            if (data.status === 'completed') {
              toast.done(toastId.current!)
              // toast.success('Guitar tabs uploaded successfully!')
              toastId.current = null
              queryClient.invalidateQueries({ queryKey })
            }
          }
        )
      } catch (error) {
        console.error(error)
        toast.error('Failed to upload guitar tabs')
      }
    }
    input.click()
  }, [queryKey, socket, queryClient])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedAuthor, isStarred, selectedSortType])

  return (
    <ModuleWrapper>
      <Header
        setGuitarWorldModalOpen={() => open(GuitarWorldModal, null)}
        setSortType={setSelectedSortType}
        setView={setView}
        sortType={selectedSortType}
        totalItems={entriesQuery.data?.totalItems}
        uploadFiles={uploadFiles}
        view={view}
      />
      <LayoutWithSidebar>
        <Sidebar
          author={selectedAuthor}
          category={selectedCategory}
          isOpen={sidebarOpen}
          setAuthor={setSelectedAuthor}
          setCategory={setSelectedCategory}
          setOpen={setSidebarOpen}
          setStarred={setStarred}
          sidebarDataQuery={sidebarDataQuery}
          starred={isStarred}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                {`${isStarred ? t('headers.starred') : ''} ${
                  selectedCategory !== null
                    ? t(`headers.${selectedCategory}`)
                    : ''
                } ${
                  !selectedAuthor && !selectedCategory && !isStarred
                    ? t('headers.all')
                    : ''
                } ${t('items.score')} ${
                  selectedAuthor !== null ? `by ${selectedAuthor}` : ''
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
            setSortType={setSelectedSortType}
            setView={setView}
            sortType={selectedSortType}
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
    </ModuleWrapper>
  )
}

export default GuitarTabs
