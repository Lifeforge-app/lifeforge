import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import MovieItem from './MovieItem'

function MovieGrid({
  data,
  onToggleWatched
}: {
  data: IMovieEntry[]
  onToggleWatched: (id: string) => Promise<void>
}) {
  return (
    <div className="mb-32 grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-3 md:mb-12">
      {data.map(item => (
        <MovieItem
          key={item.id}
          data={item}
          type="grid"
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  )
}

export default MovieGrid
