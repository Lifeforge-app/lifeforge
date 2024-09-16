import React from 'react'
import Scrollbar from '@components/Scrollbar'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
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
    <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
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
