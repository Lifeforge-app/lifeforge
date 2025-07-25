import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'

import EntryItem from './components/EntryItem'

function GridView({
  entries
}: {
  entries: ISchemaWithPB<ScoresLibraryCollectionsSchemas.IEntry>[]
}) {
  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]">
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

export default GridView
