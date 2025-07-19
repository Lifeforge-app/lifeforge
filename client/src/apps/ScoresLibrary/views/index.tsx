import { EmptyStateScreen } from 'lifeforge-ui'

import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'

import GridView from './GridView'
import ListView from './ListView'

function Views({
  entries,
  view,
  debouncedSearchQuery,
  totalItems
}: {
  entries: ISchemaWithPB<ScoresLibraryCollectionsSchemas.IEntry>[]
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
