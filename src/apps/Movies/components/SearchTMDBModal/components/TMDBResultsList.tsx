import { EmptyStateScreen, Pagination } from '@lifeforge/ui'

import { IMovieSearchResults } from '@apps/Movies/interfaces/movies_interfaces'

import TMDBResultItem from './TMDBResultItem'

function TMDBResultsList({
  results,
  page,
  setPage,
  onAddToLibrary,
  entriesIDs
}: {
  results: IMovieSearchResults | null
  page: number
  setPage: (page: number) => void
  onAddToLibrary: (id: number) => Promise<void>
  entriesIDs: number[]
}) {
  if (results === null) {
    return <></>
  }

  if (results.total_results === 0) {
    return (
      <div className="mt-6">
        <EmptyStateScreen
          icon="tabler:search-off"
          name="search"
          namespace="apps.movies"
        />
      </div>
    )
  }

  return (
    <>
      <Pagination
        className="mb-4 mt-6"
        currentPage={page}
        totalPages={results.total_pages}
        onPageChange={setPage}
      />
      <div className="mt-6 w-full space-y-2">
        {results.results.map(entry => (
          <TMDBResultItem
            key={entry.id}
            data={entry}
            isAdded={entriesIDs.includes(entry.id)}
            onAddToLibrary={onAddToLibrary}
          />
        ))}
      </div>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={results.total_pages}
        onPageChange={setPage}
      />
    </>
  )
}

export default TMDBResultsList
