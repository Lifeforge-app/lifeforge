import type { MovieEntry } from '..'
import { Stack } from '@lifeforge/ui'

import MovieItem from '../components/MovieItem'

function MovieList({ data }: { data: MovieEntry[] }) {
  return (
    <Stack as="ul" gap="sm" mb={{ base: '2xl', md: 'lg' }}>
      {data.map(item => (
        <MovieItem key={item.id} data={item} type="list" />
      ))}
    </Stack>
  )
}

export default MovieList
