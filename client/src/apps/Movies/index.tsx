import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  Tabs,
  ViewModeSelector
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import MovieGrid from './components/MovieGrid'
import MovieList from './components/MovieList'
import SearchTMDBModal from './modals/SearchTMDBModal'
import ShowTicketModal from './modals/ShowTicketModal'

export type MovieEntry = InferOutput<
  typeof forgeAPI.movies.entries.list
>['entries'][number]

function Movies() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.movies')

  const queryClient = useQueryClient()

  const [searchParams, setSearchParams] = useSearchParams()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const [currentTab, setCurrentTab] = useState<'unwatched' | 'watched'>(
    'unwatched'
  )

  const entriesQuery = useQuery(
    forgeAPI.movies.entries.list
      .input({
        watched: currentTab === 'watched'
      })
      .queryOptions()
  )

  useEffect(() => {
    if (!entriesQuery.data) return

    if (searchParams.get('show-ticket')) {
      const target = entriesQuery.data.entries.find(
        entry => entry.id === searchParams.get('show-ticket')
      )

      if (!target) return

      open(ShowTicketModal, {
        entry: target
      })
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams, entriesQuery.data])

  async function toggleWatched(id: string, isWatched: boolean = false) {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `/movies/entries/watch-status/${id}?watched=${isWatched}`,
        {
          method: 'PATCH'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['movies', 'entries']
      })
    } catch (error) {
      console.error('Error marking movie as watched:', error)
      toast.error('Failed to mark movie as watched.')
    }
  }

  const handleOpenTMDBModal = useCallback(() => {
    open(SearchTMDBModal, {})
  }, [entriesQuery.data])

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
      <div className="flex items-center gap-2">
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
          const FinalComponent = viewMode === 'grid' ? MovieGrid : MovieList

          return (
            <>
              <Tabs
                active={currentTab}
                enabled={['unwatched', 'watched']}
                items={[
                  {
                    id: 'unwatched',
                    name: t('tabs.unwatched'),
                    icon: 'tabler:eye-off',
                    amount:
                      currentTab === 'unwatched'
                        ? data.entries.length
                        : data.total - data.entries.length
                  },
                  {
                    id: 'watched',
                    name: t('tabs.watched'),
                    icon: 'tabler:eye',
                    amount:
                      currentTab === 'watched'
                        ? data.entries.length
                        : data.total - data.entries.length
                  }
                ]}
                onNavClick={setCurrentTab}
              />

              {data.entries.length === 0 ? (
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
              ) : (
                <FinalComponent
                  data={data.entries.filter(entry => {
                    const matchesSearch = entry.title
                      .toLowerCase()
                      .includes(debouncedSearchQuery.toLowerCase())

                    const matchesTab =
                      currentTab === 'unwatched'
                        ? !entry.is_watched
                        : entry.is_watched

                    return matchesSearch && matchesTab
                  })}
                  onToggleWatched={async id => toggleWatched(id)}
                />
              )}
            </>
          )
        }}
      </QueryWrapper>
      <FAB hideWhen="md" onClick={handleOpenTMDBModal} />
    </ModuleWrapper>
  )
}

export default Movies
