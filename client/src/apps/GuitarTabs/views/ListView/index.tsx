import { type IGuitarTabsEntry } from '../../interfaces/guitar_tabs_interfaces'
import EntryItem from './components/EntryItem'

function ListView({ entries }: { entries: IGuitarTabsEntry[] }) {
  return (
    <ul className="mb-6 space-y-4">
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}

export default ListView
