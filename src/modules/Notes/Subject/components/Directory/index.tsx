import React from 'react'
import { type INotesEntry } from '@interfaces/notes_interfaces'
import EntryItem from './components/EntryItem'

function Directory({
  notesEntries,
  setModifyFolderModalOpenType,
  setExistedData,
  setDeleteFolderConfirmationModalOpen
}: {
  notesEntries: INotesEntry[]
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteFolderConfirmationModalOpen: (state: boolean) => void
}): React.ReactElement {
  return (
    <ul className="mb-8 mt-6 flex h-full min-h-0 flex-col divide-y divide-bg-300 dark:divide-bg-700/50">
      {notesEntries
        .sort(
          (a, b) =>
            -a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
        )
        .map(entry => (
          <EntryItem
            key={entry.id}
            entry={entry}
            setDeleteFolderConfirmationModalOpen={
              setDeleteFolderConfirmationModalOpen
            }
            setExistedData={setExistedData}
            setModifyFolderModalOpenType={setModifyFolderModalOpenType}
          />
        ))}
    </ul>
  )
}

export default Directory
