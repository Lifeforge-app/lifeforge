import { useTranslation } from 'react-i18next'

import { EmptyStateScreen } from '@lifeforge/ui'

import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import MovieItem from './MovieItem'

function MovieList({
  data,
  onModifyTicket,
  onShowTicket,
  onDelete,
  onNewMovie,
  onToggleWatched
}: {
  data: IMovieEntry[]
  onModifyTicket: (type: 'create' | 'update', entry: IMovieEntry) => void
  onShowTicket: (id: string) => void
  onDelete: (entry: IMovieEntry) => void
  onNewMovie: () => void
  onToggleWatched: (id: string) => Promise<void>
}) {
  const { t } = useTranslation(['apps.movies', 'common.buttons'])

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
        onCTAClick={onNewMovie}
      />
    )
  }

  return (
    <div className="mt-6 mb-24 space-y-4 md:mb-6">
      {data.map(item => (
        <MovieItem
          key={item.id}
          data={item}
          type="list"
          onDelete={onDelete}
          onModifyTicket={onModifyTicket}
          onShowTicket={onShowTicket}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  )
}

export default MovieList
