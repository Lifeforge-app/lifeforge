import React from 'react'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import EntryItem from './components/EntryItem'

function GridView({
  entries,
  refreshEntries,
  setExistingEntry,
  setModifyEntryModalOpen,
  setDeleteConfirmationModalOpen
}: {
  entries: IGuitarTabsEntry[]
  refreshEntries: () => void
  setExistingEntry: React.Dispatch<React.SetStateAction<any>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {entries.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          refreshEntries={refreshEntries}
          setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
          setExistingEntry={setExistingEntry}
          setModifyEntryModalOpen={setModifyEntryModalOpen}
        />
      ))}
    </div>
  )
}

export default GridView
