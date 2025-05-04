import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import MovieGridItem from './MovieGridItem'

function MovieGrid({
  data,
  onToggleWatched
}: {
  data: IMovieEntry[]
  onToggleWatched: (id: string) => Promise<void>
}) {
  return (
    <div className="mt-6 mb-24 grid grid-cols-[repeat(auto-fit,minmax(24rem,1fr))] gap-3 md:mb-6">
      {data.map(item => (
        <MovieGridItem
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
