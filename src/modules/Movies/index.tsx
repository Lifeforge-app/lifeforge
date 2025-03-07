import { useDebounce } from '@uidotdev/usehooks'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import QueryWrapper from '@components/screens/QueryWrapper'
import useAPIQuery from '@hooks/useAPIQuery'
import { IMovieEntry } from '@interfaces/movies_interfaces'
import ModifyTicketModal from './components/ModifyTicketModal'
import MovieList from './components/MovieList'
import SearchTMDBModal from './components/SearchTMDBModal'
import ShowTicketModal from './components/ShowTicketModal'

function Movies(): React.ReactElement {
  const { t } = useTranslation('modules.movies')
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
      <SearchInput
        className="mt-6"
        namespace="modules.movies"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="movie"
      />
      <QueryWrapper query={entriesQuery}>
        {data => (
          <MovieList
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
          />
        )}
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
        onClose={() => setShowTicketModalOpenFor('')}
      />
      <DeleteConfirmationModal
        apiEndpoint="/movies/entries"
        data={toBeDeleted}
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
