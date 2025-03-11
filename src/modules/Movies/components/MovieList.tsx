import React from 'react'
import { useTranslation } from 'react-i18next'

import { EmptyStateScreen } from '@lifeforge/ui'

import { IMovieEntry } from '@interfaces/movies_interfaces'

import MovieItem from './MovieItem'

function MovieList({
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
    <div className="mb-24 mt-6 space-y-4 md:mb-6">
      {data.map(item => (
        <MovieItem
          key={item.id}
          data={item}
          type="list"
          onDelete={onDelete}
          onModifyTicket={onModifyTicket}
          onShowTicket={onShowTicket}
        />
      ))}
    </div>
  )
}

export default MovieList
