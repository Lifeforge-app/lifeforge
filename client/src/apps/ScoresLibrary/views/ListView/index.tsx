import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'

import EntryItem from './components/EntryItem'

function ListView({
  entries
}: {
  entries: ISchemaWithPB<ScoresLibraryCollectionsSchemas.IEntry>[]
}) {
  return (
    <ul className="mb-6 space-y-4">
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}

export default ListView
