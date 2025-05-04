import { type IGuitarTabsEntry } from '../../interfaces/guitar_tabs_interfaces'
import EntryItem from './components/EntryItem'

function ListView({
  entries,
  queryKey
}: {
  entries: IGuitarTabsEntry[]
  queryKey: unknown[]
}) {
  return (
    <ul className="mb-6 space-y-4">
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} queryKey={queryKey} />
      ))}
    </ul>
  )
}

export default ListView
