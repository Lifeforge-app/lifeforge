import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  EmptyStateScreen,
  LoadingScreen,
  ModalHeader,
  SearchInput
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import TMDBLogo from './components/TMDBLogo.svg'
import TMDBResultsList from './components/TMDBResultsList'

function SearchTMDBModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')

  const [searchLoading, setSearchLoading] = useState(false)

  const [page, setPage] = useState(1)

  const [searchResults, setSearchResults] = useState<
    MoviesControllersSchemas.ITmdb['searchMovies']['response'] | null
  >(null)

  async function searchTMDB(page: number = 1) {
    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query!')

      return
    }

    setSearchResults(null)
    setSearchLoading(true)

    try {
      const data = await fetchAPI<
        MoviesControllersSchemas.ITmdb['searchMovies']['response']
      >(
        import.meta.env.VITE_API_HOST,
        `movies/tmdb/search?q=${encodeURIComponent(searchQuery)}&page=${page}`
      )

      setSearchResults(data)
    } catch {
      toast.error('An error occurred while searching for movies!')
    } finally {
      setSearchLoading(false)
    }
  }

  async function addToLibrary(id: number) {
    try {
      await fetchAPI(import.meta.env.VITE_API_HOST, `movies/entries/${id}`, {
        method: 'POST'
      })

      queryClient.invalidateQueries({
        queryKey: ['movies', 'entries', 'unwatched']
      })

      setSearchResults(prevResults => {
        if (!prevResults) return null

        return {
          ...prevResults,
          results: prevResults.results.map(entry => {
            if (entry.id === id) {
              return {
                ...entry,
                existed: true
              }
            }

            return entry
          })
        }
      })

      toast.success('Movie added to library!')
    } catch {
      toast.error('An error occurred while adding the movie to your library!')
    }
  }

  useEffect(() => {
    setSearchQuery('')
    setSearchResults(null)
    setPage(1)
  }, [])

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
                searchTMDB(1)
              }
            }
          }}
        />
        <Button
          iconAtEnd
          className="w-full sm:w-auto"
          disabled={searchQuery.trim() === ''}
          icon="tabler:arrow-right"
          loading={searchLoading}
          onClick={() => {
            setPage(1)
            searchTMDB(1)
          }}
        >
          search
        </Button>
      </div>
      <div className="mt-6 w-full">
        {(() => {
          if (searchLoading) {
            return (
              <div className="h-96">
                <LoadingScreen />
              </div>
            )
          }

          if (searchResults === null) {
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
                searchTMDB(page)
              }}
              onAddToLibrary={addToLibrary}
            />
          )
        })()}
      </div>
    </div>
  )
}

export default SearchTMDBModal
