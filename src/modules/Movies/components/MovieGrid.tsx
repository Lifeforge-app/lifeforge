import React from 'react'
import { useTranslation } from 'react-i18next'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { IMovieEntry } from '@interfaces/movies_interfaces'
import MovieItem from './MovieItem'

function MovieGrid({
  data,
  onModifyTicket,
  onShowTicket,
  onDelete,
  onNewMovie
}: {
  data: IMovieEntry[]
  onModifyTicket: (type: 'create' | 'update', entry: IMovieEntry) => void
  onShowTicket: (id: string) => void
  onDelete: (entry: IMovieEntry) => void
  onNewMovie: () => void
}): React.ReactElement {
  const { t } = useTranslation(['modules.movies', 'common.buttons'])

  if (!data.length) {
    return (
      <EmptyStateScreen
        ctaContent={t('common.buttons:new', {
          item: t('modules.movies:items.movie')
        })}
        ctaIcon="tabler:plus"
        icon="tabler:movie-off"
        name="library"
        namespace="modules.movies"
        onCTAClick={onNewMovie}
      />
    )
  }

  return (
    <div className="mt-6 gap-3 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] mb-24 md:mb-6">
      {data.map(item => (
        <MovieItem
          key={item.id}
          data={item}
          type="grid"
          onDelete={onDelete}
          onModifyTicket={onModifyTicket}
          onShowTicket={onShowTicket}
        />
      ))}
    </div>
  )
}

export default MovieGrid
