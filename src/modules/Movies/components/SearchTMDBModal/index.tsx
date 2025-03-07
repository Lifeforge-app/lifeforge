import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import LoadingScreen from '@components/screens/LoadingScreen'
import { IMovieEntry, IMovieSearchResults } from '@interfaces/movies_interfaces'
import fetchAPI from '@utils/fetchAPI'
import TMDBLogo from './components/TMDBLogo.svg'
import TMDBResultsList from './components/TMDBResultsList'

function SearchTMDBModal({
  isOpen,
  onClose,
  entriesIDs,
  queryKey
}: {
  isOpen: boolean
  onClose: () => void
  entriesIDs: number[]
  queryKey: unknown[]
}): React.ReactElement {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [searchResults, setSearchResults] =
    useState<IMovieSearchResults | null>(null)

  async function searchTMDB(page: number = 1) {
    if (searchQuery.trim() === '') {
      toast.error('Please enter a search query!')
      return
    }

    setSearchResults(null)
    setSearchLoading(true)
    try {
      const data = await fetchAPI<IMovieSearchResults>(
        `movies/search?q=${encodeURIComponent(searchQuery)}&page=${page}`
      )
      setSearchResults(data)
    } catch {
      toast.error('An error occurred while searching for movies!')
    } finally {
      setSearchLoading(false)
    }
  }

  async function addToLibrary(id: number): Promise<void> {
    try {
      const data = await fetchAPI<IMovieEntry>(`movies/entries/${id}`, {
        method: 'POST'
      })

      queryClient.setQueryData<IMovieEntry[]>(queryKey, oldData => {
        if (!oldData) return oldData
        return [data, ...oldData]
      })
      toast.success('Movie added to library!')
    } catch {
      toast.error('An error occurred while adding the movie to your library!')
    }
  }

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('')
      setSearchResults(null)
      setPage(1)
    }
  }, [isOpen])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="70vw">
      <ModalHeader
        appendTitle={
          <p className="shrink-0 text-right text-sm sm:text-base text-bg-500">
            powered by&nbsp;
            <a
              className="underline"
              href="https://iconify.design"
              rel="noreferrer"
              target="_blank"
            >
              <img alt="TMDB" className="h-4 ml-2 inline" src={TMDBLogo} />
            </a>
          </p>
        }
        icon="tabler:movie"
        namespace="modules.movies"
        title="Search TMDB"
        onClose={onClose}
      />
      <div className="flex items-center gap-2">
        <SearchInput
          hasTopMargin={false}
          namespace="modules.movies"
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
      <div className="w-full mt-6">
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
                  namespace="modules.movies"
                />
              </div>
            )
          }

          return (
            <TMDBResultsList
              entriesIDs={entriesIDs}
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
    </ModalWrapper>
  )
}

export default SearchTMDBModal
