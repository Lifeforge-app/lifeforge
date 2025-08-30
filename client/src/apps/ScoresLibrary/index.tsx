import { type SocketEvent, useSocketContext } from '@providers/SocketProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  ContentWrapperWithSidebar,
  HeaderFilter,
  LayoutWithSidebar,
  ModuleWrapper,
  Pagination,
  Scrollbar,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef } from 'react'
import { type Id, toast } from 'react-toastify'
import { type InferInput, type InferOutput } from 'shared'

import Header from './components/Header'
import InnerHeader from './components/InnerHeader'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import GuitarWorldModal from './components/modals/GuitarWorldModal'
import useFilter from './hooks/useFilter'
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

export type ScoreLibrarySortType = NonNullable<
  InferInput<typeof forgeAPI.scoresLibrary.entries.list>['query']['sort']
> | null

export type ScoreLibraryCollection = InferOutput<
  typeof forgeAPI.scoresLibrary.collections.list
>[number]

function ScoresLibrary() {
  const {
    searchQuery,
    category,
    collection,
    starred,
    author,
    sort,
    page,
    updateFilter
  } = useFilter()

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const entriesQuery = useQuery(
    forgeAPI.scoresLibrary.entries.list
      .input({
        page: page.toString(),
        query: debouncedSearchQuery,
        category: category ? category : undefined,
        collection: collection ? collection : undefined,
        starred: starred ? 'true' : 'false',
        author: author ? author : undefined,
        sort
      })
      .queryOptions()
  )

  const sidebarDataQuery = useQuery(
    forgeAPI.scoresLibrary.entries.sidebarData.queryOptions()
  )

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

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
              console.error(data.error)
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
    updateFilter('page', 1)
  }, [debouncedSearchQuery, category, collection, starred, author, sort])

  return (
    <ModuleWrapper>
      <Header
        setGuitarWorldModalOpen={() => open(GuitarWorldModal, null)}
        totalItems={entriesQuery.data?.totalItems}
        uploadFiles={uploadFiles}
      />
      <LayoutWithSidebar>
        <Sidebar sidebarDataQuery={sidebarDataQuery} />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={entriesQuery.data?.totalItems ?? 0} />
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
              },
              collection: {
                data: collectionsQuery.data ?? []
              }
            }}
            setValues={{
              type: value => updateFilter('category', value),
              author: value => updateFilter('author', value),
              collection: value => updateFilter('collection', value)
            }}
            values={{
              type: category,
              author,
              collection
            }}
          />
          <Searchbar />
          <WithQuery query={entriesQuery}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <Pagination
                  className="mb-4"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={page => updateFilter('page', page)}
                />
                <Views
                  debouncedSearchQuery={debouncedSearchQuery}
                  entries={entries.items}
                  totalItems={entries.totalItems}
                />
                <Pagination
                  className="mt-4 pb-12"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={page => updateFilter('page', page)}
                />
              </Scrollbar>
            )}
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </ModuleWrapper>
  )
}

export default ScoresLibrary
