import { EmptyStateScreen } from 'lifeforge-ui'

import {
  GuitarTabsCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

import GridView from './GridView'
import ListView from './ListView'

function Views({
  entries,
  view,
  debouncedSearchQuery,
  totalItems
}: {
  entries: ISchemaWithPB<GuitarTabsCollectionsSchemas.IEntry>[]
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
      return <GridView entries={entries} />
    case 'list':
      return <ListView entries={entries} />
  }
}

export default Views
