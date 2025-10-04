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

  const Component = {
    grid: GridView,
    list: ListView
  }[view]

  if (totalItems === 0) {
    return (
      <EmptyStateScreen
        icon="tabler:music-off"
        name={debouncedSearchQuery.trim() === '' ? 'score' : 'result'}
        namespace="apps.scoresLibrary"
      />
    )
  }

  return <Component entries={entries} />
}

export default Views
