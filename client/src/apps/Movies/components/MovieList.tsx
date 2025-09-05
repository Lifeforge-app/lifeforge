import type { MovieEntry } from '..'
import MovieItem from './MovieItem'

function MovieList({ data }: { data: MovieEntry[] }) {
  return (
    <ul className="mb-24 space-y-3 md:mb-12">
      {data.map(item => (
        <MovieItem key={item.id} data={item} type="list" />
      ))}
    </ul>
  )
}

export default MovieList
