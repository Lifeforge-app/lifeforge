import type { MovieEntry } from '..'
import MovieItem from './MovieItem'

function MovieGrid({ data }: { data: MovieEntry[] }) {
  return (
    <div className="mb-32 grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-3 md:mb-12">
      {data.map(item => (
        <MovieItem key={item.id} data={item} type="grid" />
      ))}
    </div>
  )
}

export default MovieGrid
