import type { MovieEntry } from '..'
import MovieItem from './MovieItem'

function MovieList({ data }: { data: MovieEntry[] }) {
  return (
    <div className="mb-24 space-y-4 md:mb-12">
      {data.map(item => (
        <MovieItem key={item.id} data={item} type="list" />
      ))}
    </div>
  )
}

export default MovieList
