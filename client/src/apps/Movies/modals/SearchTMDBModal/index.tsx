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
import type { InferOutput } from 'shared'

import TMDBLogo from './components/TMDBLogo.svg'
import TMDBResultsList from './components/TMDBResultsList'

export type TMDBSearchResults = InferOutput<typeof forgeAPI.movies.tmdb.search>

function SearchTMDBModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')

  const [queryToSearch, setQueryToSearch] = useState('')

  const [page, setPage] = useState(1)

  const searchResultsQuery = useQuery(
    forgeAPI.movies.tmdb.search
      .input({
        q: queryToSearch,
        page: page.toString()
      })
      .queryOptions({
        enabled: !!queryToSearch
      })
  )

  const onAddToLibrary = async () => {
    await queryClient.invalidateQueries({
      queryKey: forgeAPI.movies.entries.list.input({ watched: 'false' }).key
    })
    await queryClient.invalidateQueries({
      queryKey: forgeAPI.movies.tmdb.search.input({
        q: queryToSearch,
        page: page.toString()
      }).key
    })

    toast.success('Movie added to your library!')
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
          namespace="apps.movies"
          value={searchQuery}
          setValue={setSearchQuery}
          searchTarget="movie"
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
          iconPosition="end"
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
        {queryToSearch ? (
          <QueryWrapper query={searchResultsQuery}>
            {searchResults => (
              <TMDBResultsList
                page={page}
                results={searchResults}
                setPage={setPage}
                onAddToLibrary={onAddToLibrary}
              />
            )}
          </QueryWrapper>
        ) : (
          <div className="h-96">
            <EmptyStateScreen
              icon={<img alt="TMDB" className="h-24" src={TMDBLogo} />}
              name="tmdb"
              namespace="apps.movies"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchTMDBModal
