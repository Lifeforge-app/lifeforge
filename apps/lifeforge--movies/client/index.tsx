import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Scrollbar,
  SearchInput,
  Tabs,
  ViewModeSelector,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'shared'
import type { InferOutput } from 'shared'

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

  const [searchParams, setSearchParams] = useSearchParams()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [searchQuery, setSearchQuery] = useState('')

  const [currentTab, setCurrentTab] = useState<'unwatched' | 'watched'>(
    'unwatched'
  )

  const entriesQuery = useQuery(
    forgeAPI.movies.entries.list
      .input({
        watched: currentTab === 'watched' ? 'true' : 'false'
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

  const handleOpenTMDBModal = useCallback(() => {
    open(SearchTMDBModal, {})
  }, [entriesQuery.data])

  return (
    <>
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
      />
      <div className="flex items-center gap-2">
        <SearchInput
          debounceMs={300}
          namespace="apps.movies"
          searchTarget="movie"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <ViewModeSelector
          className="hidden md:flex"
          currentMode={viewMode}
          options={[
            { icon: 'uil:apps', value: 'grid' },
            { icon: 'tabler:list', value: 'list' }
          ]}
          onModeChange={setViewMode}
        />
      </div>
      <WithQuery query={entriesQuery}>
        {data => {
          const FinalComponent = viewMode === 'grid' ? MovieGrid : MovieList

          return (
            <div className="flex flex-1 flex-col space-y-3">
              <Tabs
                currentTab={currentTab}
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
                onTabChange={setCurrentTab}
              />
              {data.entries.length === 0 ? (
                <EmptyStateScreen
                  CTAButtonProps={{
                    onClick: handleOpenTMDBModal,
                    tProps: { item: t('items.movie') },
                    icon: 'tabler:plus',
                    children: 'new'
                  }}
                  icon="tabler:movie-off"
                  message={{
                    id: 'library',
                    namespace: 'apps.movies'
                  }}
                />
              ) : (
                <Scrollbar>
                  <FinalComponent
                    data={data.entries.filter(entry => {
                      const matchesSearch = entry.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())

                      const matchesTab =
                        currentTab === 'unwatched'
                          ? !entry.is_watched
                          : entry.is_watched

                      return matchesSearch && matchesTab
                    })}
                  />
                </Scrollbar>
              )}
            </div>
          )
        }}
      </WithQuery>
      <FAB visibilityBreakpoint="md" onClick={handleOpenTMDBModal} />
    </>
  )
}

export default Movies
