import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import MovieItem from './MovieItem'

function MovieList({
  data,
  onToggleWatched
}: {
  data: IMovieEntry[]
  onToggleWatched: (id: string) => Promise<void>
}) {
  return (
    <div className="mb-24 space-y-4 md:mb-12">
      {data.map(item => (
        <MovieItem
          key={item.id}
          data={item}
          type="list"
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  )
}

export default MovieList
