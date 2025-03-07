import React from 'react'
import { IMovieEntry } from '@interfaces/movies_interfaces'
import MovieListItem from './MovieListItem'

function MovieList({
  data,
  onModifyTicket,
  onShowTicket,
  onDelete
}: {
  data: IMovieEntry[]
  onModifyTicket: (type: 'create' | 'update', id: string) => void
  onShowTicket: (id: string) => void
  onDelete: (entry: IMovieEntry) => void
}): React.ReactElement {
  return (
    <div className="mt-6 space-y-4 mb-24 md:mb-6">
      {data.map(item => (
        <MovieListItem
          key={item.id}
          data={item}
          onDelete={onDelete}
          onModifyTicket={onModifyTicket}
          onShowTicket={onShowTicket}
        />
      ))}
    </div>
  )
}

export default MovieList
