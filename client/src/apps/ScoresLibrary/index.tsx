import { useQuery } from '@tanstack/react-query'
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
import { useEffect } from 'react'
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

  useEffect(() => {
    updateFilter('page', 1)
  }, [debouncedSearchQuery, category, collection, starred, author, sort])

  return (
    <ModuleWrapper>
      <Header
        setGuitarWorldModalOpen={() => open(GuitarWorldModal, null)}
        totalItems={entriesQuery.data?.totalItems}
      />
      <LayoutWithSidebar>
        <Sidebar />
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
              <Scrollbar className="mt-6 space-y-3">
                <Pagination
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
                  className="mb-6"
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
