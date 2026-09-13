import type { InferOutput } from '@lifeforge/api'
import { Card, Flex } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ActionButton from './components/ActionButton'
import ActionMenu from './components/ActionMenu'
import MovieMetadata from './components/MovieMetadata'
import MoviePoster from './components/MoviePoster'
import MovieItemProvider from './contexts/MovieItemContext'

function MovieItem({
  data,
  type
}: {
  data: InferOutput<typeof forgeAPI.entries.list>['entries'][number]
  type: 'grid' | 'list'
}) {
  return (
    <MovieItemProvider data={data} type={type}>
      <Card
        as="li"
        direction={type === 'grid' ? 'column' : { base: 'column', md: 'row' }}
        gap="md"
      >
        <MoviePoster />
        <Flex direction="column" flex="1" width="100%">
          <MovieMetadata />
          <ActionButton />
        </Flex>
        <ActionMenu />
      </Card>
    </MovieItemProvider>
  )
}

export default MovieItem
