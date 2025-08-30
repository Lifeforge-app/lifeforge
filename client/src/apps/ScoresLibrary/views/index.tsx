import { EmptyStateScreen } from 'lifeforge-ui'

import type { ScoreLibraryEntry } from '..'
import useFilter from '../hooks/useFilter'
import GridView from './GridView'
import ListView from './ListView'

function Views({
  entries,
  debouncedSearchQuery,
  totalItems
}: {
  entries: ScoreLibraryEntry[]
  debouncedSearchQuery: string
  totalItems: number
}) {
  const { view } = useFilter()

  if (totalItems === 0) {
    if (debouncedSearchQuery.trim() === '') {
      return (
        <EmptyStateScreen
          icon="tabler:music-off"
          name="score"
          namespace="apps.scoresLibrary"
        />
      )
    }

    return (
      <EmptyStateScreen
        icon="tabler:search-off"
        name="result"
        namespace="apps.scoresLibrary"
      />
    )
  }

  switch (view) {
    case 'grid':
      return <GridView entries={entries} />
    case 'list':
      return <ListView entries={entries} />
  }
}

export default Views
