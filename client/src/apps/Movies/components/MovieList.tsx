import { ISchemaWithPB } from 'shared/types/collections'
import { MoviesControllersSchemas } from 'shared/types/controllers'

import MovieItem from './MovieItem'

function MovieList({
  data,
  onToggleWatched
}: {
  data: ISchemaWithPB<MoviesControllersSchemas.IEntries>[]
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
