import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import { WithQuery } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

import MovieHeader from './components/MovieHeader'
import MovieTab, { MovieTabbedView } from './components/MovieTab'
import { ViewModes } from './views'

export type MovieEntry = InferOutput<
  typeof forgeAPI.entries.list
>['entries'][number]

function Movies() {
  const { searchQuery, setSearchQuery } = useFilter()
  const currentTab = MovieTabbedView.useContext(s => s.currentTab)

  const entriesQuery = useQuery(
    forgeAPI.entries.list
      .input({
        watched: currentTab === 'watched' ? 'true' : 'false'
      })
      .queryOptions()
  )

  return (
    <ViewModes.Root>
      <MovieHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <MovieTabbedView.Root>
        <WithQuery query={entriesQuery}>
          {data => <MovieTab data={data} />}
        </WithQuery>
      </MovieTabbedView.Root>
    </ViewModes.Root>
  )
}

export default Movies
