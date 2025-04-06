import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  Button,
  DeleteConfirmationModal,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  ViewModeSelector
} from '@lifeforge/ui'

import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import ModifyTicketModal from './components/ModifyTicketModal'
import MovieGrid from './components/MovieGrid'
import MovieList from './components/MovieList'
import SearchTMDBModal from './components/SearchTMDBModal'
import ShowTicketModal from './components/ShowTicketModal'

function Movies() {
  const { t } = useTranslation('apps.movies')
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTMDBModal, setSearchTMDBModal] = useState(false)
  const [modifyTicketModalOpenType, setModifyTicketModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [showTicketModalOpenFor, setShowTicketModalOpenFor] = useState('')
  const [toBeDeleted, setToBeDeleted] = useState<IMovieEntry | null>(null)
  const [toBeUpdated, setToBeUpdated] = useState<IMovieEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const queryKey = useMemo(
    () => ['movies', 'entries', debouncedSearchQuery],
    [debouncedSearchQuery]
  )
  const entriesQuery = useAPIQuery<IMovieEntry[]>('movies/entries', queryKey)

  useEffect(() => {
    if (searchParams.get('show-ticket')) {
      setShowTicketModalOpenFor(searchParams.get('show-ticket') ?? '')
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  async function toggleWatched(id: string, isWatched: boolean = false) {
    try {
      await fetchAPI<IMovieEntry>(
        `/movies/entries/watch-status/${id}?watched=${isWatched}`,
        {
          method: 'PATCH'
        }
      )

      queryClient.setQueryData<IMovieEntry[]>(queryKey, oldData => {
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
      })
    } catch (error) {
      console.error('Error marking movie as watched:', error)
      toast.error('Failed to mark movie as watched.')
    }
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.movie') }}
            onClick={() => setSearchTMDBModal(true)}
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
          const FinalComponent = viewMode === 'grid' ? MovieGrid : MovieList
          return (
            <FinalComponent
              data={data.filter(entry =>
                entry.title
                  .toLowerCase()
                  .includes(debouncedSearchQuery.toLowerCase())
              )}
              onDelete={entry => setToBeDeleted(entry)}
              onModifyTicket={(type, entry) => {
                setModifyTicketModalOpenType(type)
                setToBeUpdated(entry)
              }}
              onNewMovie={() => setSearchTMDBModal(true)}
              onShowTicket={id => setShowTicketModalOpenFor(id)}
              onToggleWatched={async id => toggleWatched(id)}
            />
          )
        }}
      </QueryWrapper>
      <SearchTMDBModal
        entriesIDs={entriesQuery.data?.map(entry => entry.tmdb_id) ?? []}
        isOpen={searchTMDBModal}
        queryKey={queryKey}
        onClose={() => setSearchTMDBModal(false)}
      />
      <ModifyTicketModal
        existedData={toBeUpdated}
        openType={modifyTicketModalOpenType}
        queryKey={queryKey}
        setOpenType={setModifyTicketModalOpenType}
      />
      <ShowTicketModal
        entry={entriesQuery.data?.find(
          entry => entry.id === showTicketModalOpenFor
        )}
        isOpen={Boolean(showTicketModalOpenFor)}
        onClose={added => {
          if (added) {
            entriesQuery.refetch()
          }
          setShowTicketModalOpenFor('')
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="/movies/entries"
        data={toBeDeleted ?? undefined}
        isOpen={Boolean(toBeDeleted)}
        itemName="movie"
        nameKey="title"
        queryKey={queryKey}
        onClose={() => setToBeDeleted(null)}
      />
      <FAB hideWhen="md" onClick={() => setSearchTMDBModal(true)} />
    </ModuleWrapper>
  )
}

export default Movies
