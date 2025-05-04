import { EmptyStateScreen } from '@lifeforge/ui'

import { IGuitarTabsEntry } from '../interfaces/guitar_tabs_interfaces'
import GridView from './GridView'
import ListView from './ListView'

function Views({
  entries,
  queryKey,
  view,
  debouncedSearchQuery,
  totalItems
}: {
  entries: IGuitarTabsEntry[]
  queryKey: unknown[]
  view: 'grid' | 'list'
  debouncedSearchQuery: string
  totalItems: number
}) {
  if (totalItems === 0) {
    if (debouncedSearchQuery.trim() === '') {
      return (
        <EmptyStateScreen
          icon="tabler:music-off"
          name="score"
          namespace="apps.guitarTabs"
        />
      )
    }

    return (
      <EmptyStateScreen
        icon="tabler:search-off"
        name="result"
        namespace="apps.guitarTabs"
      />
    )
  }

  switch (view) {
    case 'grid':
      return <GridView entries={entries} queryKey={queryKey} />
    case 'list':
      return <ListView entries={entries} queryKey={queryKey} />
  }
}

export default Views
