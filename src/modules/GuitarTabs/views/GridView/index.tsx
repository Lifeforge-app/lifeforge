import React from 'react'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'
import EntryItem from './components/EntryItem'

function GridView({
  entries,
  setExistingEntry,
  setModifyEntryModalOpen
}: {
  entries: IGuitarTabsEntry[]
  setExistingEntry: React.Dispatch<React.SetStateAction<any>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {entries.map(entry => (
        <EntryItem
          key={entry.id}
          entry={entry}
          setExistingEntry={setExistingEntry}
          setModifyEntryModalOpen={setModifyEntryModalOpen}
        />
      ))}
    </div>
  )
}

export default GridView
