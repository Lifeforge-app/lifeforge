import React from 'react'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import EntryItem from './components/EntryItem'

function ListView({
  entries,
  setExistingEntry,
  setModifyEntryModalOpen,
  setDeleteConfirmationModalOpen
}: {
  entries: IGuitarTabsEntry[]
  setExistingEntry: React.Dispatch<React.SetStateAction<any>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <ul className="mb-6 space-y-4">
      {entries.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          setExistingEntry={setExistingEntry}
          setModifyEntryModalOpen={setModifyEntryModalOpen}
        />
      ))}
    </ul>
  )
}

export default ListView
