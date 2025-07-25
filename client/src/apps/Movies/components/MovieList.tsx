import MovieItem from './MovieItem'

function MovieList({
  data,
  onToggleWatched
}: {
  data: ISchemaWithPB<MoviesCollectionsSchemas.IEntry>[]
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
