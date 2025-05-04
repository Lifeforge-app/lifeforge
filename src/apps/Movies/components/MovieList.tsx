import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import MovieGridItem from './MovieGridItem'

function MovieList({
  data,
  onToggleWatched
}: {
  data: IMovieEntry[]
  onToggleWatched: (id: string) => Promise<void>
}) {
  return (
    <div className="mt-6 mb-24 space-y-4 md:mb-6">
      {data.map(item => (
        <MovieGridItem
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
