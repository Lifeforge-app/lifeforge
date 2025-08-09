import { type SocketEvent, useSocketContext } from '@providers/SocketProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ContentWrapperWithSidebar,
  HeaderFilter,
  LayoutWithSidebar,
  ModuleWrapper,
  Pagination,
  QueryWrapper,
  Scrollbar
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Id, toast } from 'react-toastify'
import type { InferInput, InferOutput } from 'shared'

import Header from './components/Header'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import GuitarWorldModal from './components/modals/GuitarWorldModal'
import Views from './views'

export type ScoreLibraryEntry = InferOutput<
  typeof forgeAPI.scoresLibrary.entries.list
>['items'][number]

export type ScoreLibraryType = InferOutput<
  typeof forgeAPI.scoresLibrary.types.list
>[number]

export type ScoreLibrarySidebarData = InferOutput<
  typeof forgeAPI.scoresLibrary.entries.sidebarData
>

export type ScoreLibrarySortType = InferInput<
  typeof forgeAPI.scoresLibrary.entries.list
>['query']['sort']

export type ScoreLibraryCollection = InferOutput<
  typeof forgeAPI.scoresLibrary.collections.list
>[number]

function ScoresLibrary() {
  const { t } = useTranslation('apps.scoresLibrary')

  const [view, setView] = useState<'grid' | 'list'>('grid')

  const [page, setPage] = useState<number>(1)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  )

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)

  const [isStarred, setStarred] = useState<boolean>(false)

  const [selectedSortType, setSelectedSortType] =
    useState<ScoreLibrarySortType>('newest')

  const entriesQuery = useQuery(
    forgeAPI.scoresLibrary.entries.list
      .input({
        page,
        query: debouncedSearchQuery,
        category: selectedCategory ? selectedCategory : undefined,
        collection: selectedCollection ? selectedCollection : undefined,
        starred: isStarred,
        author: selectedAuthor ? selectedAuthor : undefined,
        sort: selectedSortType
      })
      .queryOptions()
  )

  const sidebarDataQuery = useQuery(
    forgeAPI.scoresLibrary.entries.sidebarData.queryOptions()
  )

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

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

      if (files === null) {
        return
      }

      if (files.length > 100) {
        toast.error('You can only upload 100 files at a time!')

        return
      }

      try {
        const taskId = await forgeAPI.scoresLibrary.entries.upload.mutate({
          files: Array.from(files)
        })

        socket.on(
          'taskPoolUpdate',
          (
            data: SocketEvent<
              undefined,
              {
                left: number
                total: number
              }
            >
          ) => {
            if (!data || data.taskId !== taskId) return

            if (data.status === 'failed') {
              toast.done(toastId.current!)
              console.log(data.error)
              toastId.current = null
              setTimeout(() => toast.error('Failed to upload scores!'), 100)

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
              toastId.current = null
              queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
            }
          }
        )
      } catch (error) {
        console.error(error)
        toast.done(toastId.current!)
        setTimeout(() => toast.error('Failed to upload scores'), 100)
      }
    }
    input.click()
  }, [socket, queryClient])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [
    selectedCategory,
    selectedCollection,
    selectedAuthor,
    isStarred,
    selectedSortType
  ])

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
          collection={selectedCollection}
          isOpen={sidebarOpen}
          setAuthor={setSelectedAuthor}
          setCategory={setSelectedCategory}
          setCollection={setSelectedCollection}
          setOpen={setSidebarOpen}
          setStarred={setStarred}
          sidebarDataQuery={sidebarDataQuery}
          starred={isStarred}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold">
                {[
                  isStarred && t('header.starred'),
                  selectedAuthor || selectedCategory
                    ? t('header.filteredScores')
                    : t('header.allScores')
                ]
                  .filter(Boolean)
                  .join(' ')}
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
          <HeaderFilter
            items={{
              type: {
                data: typesQuery.data ?? []
              },
              author: {
                data:
                  Object.keys(sidebarDataQuery.data?.authors ?? {}).map(
                    author => ({
                      id: author,
                      name: author,
                      icon: 'tabler:user'
                    })
                  ) ?? []
              }
            }}
            setValues={{
              type: setSelectedCategory,
              author: setSelectedAuthor
            }}
            values={{
              type: selectedCategory,
              author: selectedAuthor
            }}
          />
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

export default ScoresLibrary
