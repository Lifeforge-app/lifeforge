import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  ViewModeSelector
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import MovieGrid from './components/MovieGrid'
import MovieList from './components/MovieList'
import { moviesModals } from './modals'

function Movies() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.movies')
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const entriesQuery = useAPIQuery<IMovieEntry[]>('movies/entries', [
    'movies',
    'entries'
  ])

  useEffect(() => {
    if (!entriesQuery.data) return

    if (searchParams.get('show-ticket')) {
      const target = entriesQuery.data.find(
        entry => entry.id === searchParams.get('show-ticket')
      )
      if (!target) return

      open('movies.showTicket', {
        entry: target
      })
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams, entriesQuery.data])

  async function toggleWatched(id: string, isWatched: boolean = false) {
    try {
      await fetchAPI<IMovieEntry>(
        `/movies/entries/watch-status/${id}?watched=${isWatched}`,
        {
          method: 'PATCH'
        }
      )

      queryClient.setQueryData<IMovieEntry[]>(
        ['movies', 'entries'],
        oldData => {
          if (!oldData) return []

          return oldData.map(entry => {
            if (entry.id === id) {
              return {
                ...entry,
                is_watched: !entry.is_watched
              }
            }
            return entry
          })
        }
      )
    } catch (error) {
      console.error('Error marking movie as watched:', error)
      toast.error('Failed to mark movie as watched.')
    }
  }

  const handleOpenTMDBModal = useCallback(() => {
    open('movies.searchTMDB', {
      entriesIDs: entriesQuery.data?.map(entry => entry.id) ?? []
    })
  }, [entriesQuery.data])

  useModalsEffect(moviesModals)

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.movie') }}
            onClick={handleOpenTMDBModal}
          >
            new
          </Button>
        }
        icon="tabler:movie"
        title="Movies"
      />
      <div className="mt-6 flex items-center gap-2">
        <SearchInput
          namespace="apps.movies"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="movie"
        />
        <ViewModeSelector
          className="hidden md:flex"
          options={[
            { icon: 'uil:apps', value: 'grid' },
            { icon: 'tabler:list', value: 'list' }
          ]}
          setViewMode={setViewMode}
          viewMode={viewMode}
        />
      </div>
      <QueryWrapper query={entriesQuery}>
        {data => {
          if (!data.length) {
            return (
              <EmptyStateScreen
                ctaContent={t('common.buttons:new', {
                  item: t('apps.movies:items.movie')
                })}
                ctaIcon="tabler:plus"
                icon="tabler:movie-off"
                name="library"
                namespace="apps.movies"
                onCTAClick={handleOpenTMDBModal}
              />
            )
          }

          const FinalComponent = viewMode === 'grid' ? MovieGrid : MovieList
          return (
            <FinalComponent
              data={data.filter(entry =>
                entry.title
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              )}
              onToggleWatched={async id => toggleWatched(id)}
            />
          )
        }}
      </QueryWrapper>
      <FAB hideWhen="md" onClick={handleOpenTMDBModal} />
    </ModuleWrapper>
  )
}

export default Movies
