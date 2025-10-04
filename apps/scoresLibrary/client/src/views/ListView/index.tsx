import type { ScoreLibraryEntry } from '@'

import EntryItem from './components/EntryItem'

function ListView({ entries }: { entries: ScoreLibraryEntry[] }) {
  return (
    <ul className="mb-6 space-y-3">
      {entries.map(entry => (
        <EntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}

export default ListView
