import { useQuery } from '@tanstack/react-query'

import {
  EmptyStateScreen,
  Pagination,
  WithQuery,
  createViewMode
} from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

import GridView from './GridView'
import ListView from './ListView'

export const ViewMode = createViewMode({
  modes: [
    { value: 'list', icon: 'uil:list-ul' },
    { value: 'grid', icon: 'uil:apps' }
  ],
  selectorProps: {
    display: { base: 'none', md: 'flex' }
  }
})

export default function BookListing() {
  const {
    page,
    setPage,
    collection,
    language,
    favourite,
    fileType,
    readStatus,
    searchQuery
  } = useFilter()

  const dataQuery = useQuery(
    forgeAPI.entries.list
      .input({
        page: page.toString(),
        collection: collection || undefined,
        language: language || undefined,
        favourite: (favourite.toString() as 'true' | 'false') || undefined,
        fileType: fileType || undefined,
        readStatus: readStatus || undefined,
        query: searchQuery.trim() || undefined
      })
      .queryOptions()
  )

  return (
    <WithQuery query={dataQuery}>
      {entries => {
        if (entries.items.length === 0) {
          return (
            <EmptyStateScreen
              icon={
                searchQuery.trim() ? 'tabler:search-off' : 'tabler:books-off'
              }
              message={{
                id: searchQuery.trim() ? 'result' : 'book'
              }}
            />
          )
        }

        return (
          <>
            <Pagination
              mb="lg"
              page={page}
              totalPages={entries.totalPages}
              onPageChange={setPage}
            />
            <ViewMode.When mode="list">
              <ListView books={entries.items} />
            </ViewMode.When>
            <ViewMode.When mode="grid">
              <GridView books={entries.items} />
            </ViewMode.When>
          </>
        )
      }}
    </WithQuery>
  )
}
