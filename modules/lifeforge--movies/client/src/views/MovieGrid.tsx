import { Grid } from '@lifeforge/ui'

import type { MovieEntry } from '..'
import MovieItem from '../components/MovieItem'

function MovieGrid({ data }: { data: MovieEntry[] }) {
  return (
    <Grid
      as="ul"
      gap="sm"
      mb={{ base: '2xl', md: 'lg' }}
      templateCols={{
        base: 'repeat(auto-fill,minmax(16rem,1fr))',
        sm: 'repeat(auto-fill,minmax(20rem,1fr))'
      }}
    >
      {data.map(item => (
        <MovieItem key={item.id} data={item} type="grid" />
      ))}
    </Grid>
  )
}

export default MovieGrid
