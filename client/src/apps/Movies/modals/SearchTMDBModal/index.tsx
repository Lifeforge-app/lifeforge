import { useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  ModalHeader,
  QueryWrapper,
  SearchInput
} from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import TMDBLogo from './components/TMDBLogo.svg'
import TMDBResultsList from './components/TMDBResultsList'

function SearchTMDBModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')

  const [queryToSearch, setQueryToSearch] = useState('')

  const [page, setPage] = useState(1)

  const searchResultsQuery = useQuery(
    forgeAPI.movies.tmdb.search
      .input({
        q: queryToSearch,
        page
      })
      .queryOptions({
        enabled: !!queryToSearch
      })
  )

  async function addToLibrary(id: number) {
    try {
      await fetchAPI(import.meta.env.VITE_API_HOST, `movies/entries/${id}`, {
        method: 'POST'
      })

      queryClient.invalidateQueries({
        queryKey: ['movies', 'entries', 'unwatched']
      })

      queryClient.setQueryData(
        forgeAPI.movies.tmdb.search.input({
          q: queryToSearch,
          page
        }).key,
        (prevResults: any) => {
          if (!prevResults) return null

          return {
            ...prevResults,
            results: prevResults.results.map((entry: any) => {
              if (entry.id === id) {
                return {
                  ...entry,
                  existed: true
                }
              }

              return entry
            })
          }
        }
      )

      toast.success('Movie added to library!')
    } catch {
      toast.error('An error occurred while adding the movie to your library!')
    }
  }

  return (
    <div className="min-w-[70vw]">
      <ModalHeader
        appendTitle={
          <p className="text-bg-500 shrink-0 text-right text-sm sm:text-base">
            powered by&nbsp;
            <a
              className="underline"
              href="https://iconify.design"
              rel="noreferrer"
              target="_blank"
            >
              <img alt="TMDB" className="ml-2 inline h-4" src={TMDBLogo} />
            </a>
          </p>
        }
        icon="tabler:movie"
        namespace="apps.movies"
        title="Search TMDB"
        onClose={onClose}
      />
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <SearchInput
          lighter
          namespace="apps.movies"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="movie"
          onKeyUp={e => {
            if (e.key === 'Enter') {
              if (searchQuery.trim() !== '') {
                setPage(1)
                setQueryToSearch(searchQuery.trim())
              }
            }
          }}
        />
        <Button
          iconAtEnd
          className="w-full sm:w-auto"
          disabled={searchQuery.trim() === ''}
          icon="tabler:arrow-right"
          loading={searchResultsQuery.isLoading}
          onClick={() => {
            setPage(1)
            setQueryToSearch(searchQuery.trim())
          }}
        >
          search
        </Button>
      </div>
      <div className="mt-6">
        <QueryWrapper query={searchResultsQuery}>
          {searchResults => {
            if (searchResults.total_results === 0) {
              return (
                <div className="h-96">
                  <EmptyStateScreen
                    icon={<img alt="TMDB" className="h-24" src={TMDBLogo} />}
                    name="tmdb"
                    namespace="apps.movies"
                  />
                </div>
              )
            }

            return (
              <TMDBResultsList
                page={page}
                results={searchResults}
                setPage={(page: number) => {
                  setPage(page)
                }}
                onAddToLibrary={addToLibrary}
              />
            )
          }}
        </QueryWrapper>
      </div>
    </div>
  )
}

export default SearchTMDBModal
