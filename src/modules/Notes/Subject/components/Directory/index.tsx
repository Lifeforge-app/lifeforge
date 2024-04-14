/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type INotesEntry } from '@typedec/Notes'
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
    <ul className="mt-6 flex h-full min-h-0 flex-col divide-y divide-bg-300 overflow-y-auto dark:divide-bg-700/50">
      {notesEntries
        .sort(
          (a, b) =>
            -a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
        )
        .map(entry => (
          <EntryItem
            key={entry.id}
            entry={entry}
            setModifyFolderModalOpenType={setModifyFolderModalOpenType}
            setExistedData={setExistedData}
            setDeleteFolderConfirmationModalOpen={
              setDeleteFolderConfirmationModalOpen
            }
          />
        ))}
    </ul>
  )
}

export default Directory
