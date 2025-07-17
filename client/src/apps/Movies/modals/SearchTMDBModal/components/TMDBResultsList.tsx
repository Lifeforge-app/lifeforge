import { EmptyStateScreen, Pagination } from 'lifeforge-ui'

import { IMovieSearchResults } from '@apps/Movies/interfaces/movies_interfaces'

import TMDBResultItem from './TMDBResultItem'

function TMDBResultsList({
  results,
  page,
  setPage,
  onAddToLibrary
}: {
  results: IMovieSearchResults | null
  page: number
  setPage: (page: number) => void
  onAddToLibrary: (id: number) => Promise<void>
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
        className="mt-6 mb-4"
        currentPage={page}
        totalPages={results.total_pages}
        onPageChange={setPage}
      />
      <div className="mt-6 w-full space-y-2">
        {results.results.map(entry => (
          <TMDBResultItem
            key={entry.id}
            data={entry}
            isAdded={entry.existed}
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
