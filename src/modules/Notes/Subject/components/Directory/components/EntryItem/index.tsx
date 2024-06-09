/* eslint-disable @typescript-eslint/no-non-null-assertion */

import FILE_ICONS from '@constants/file_icons'
import { Icon } from '@iconify/react'
import React from 'react'
import { type INotesEntry } from '@typedec/Notes'
import EntryButton from './components/EntryButton'
import EntryCreationDate from './components/EntryCreationDate'
import EntryMenu from './components/EntryMenu'
import EntryName from './components/EntryName'

function EntryItem({
  entry,
  setModifyFolderModalOpenType,
  setExistedData,
  setDeleteFolderConfirmationModalOpen
}: {
  entry: INotesEntry
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteFolderConfirmationModalOpen: (state: boolean) => void
}): React.ReactElement {
  return (
    <li
      key={entry.id}
      className="relative mt-0 flex min-w-0 items-center justify-between gap-4 p-6"
    >
      <Icon
        icon={
          {
            file:
              FILE_ICONS[
                entry.name.split('.').pop()! as keyof typeof FILE_ICONS
              ] ?? 'tabler:file',
            folder: 'tabler:folder'
          }[entry.type]
        }
        className="pointer-events-auto z-50 size-7 shrink-0 text-bg-500"
      />
      <div className="flex w-full min-w-0 items-center justify-between gap-8">
        <EntryName name={entry.name} />
        <EntryCreationDate date={entry.created} id={entry.id} />
        <EntryButton entry={entry} />
        <EntryMenu
          entry={entry}
          setModifyFolderModalOpenType={setModifyFolderModalOpenType}
          setExistedData={setExistedData}
          setDeleteFolderConfirmationModalOpen={
            setDeleteFolderConfirmationModalOpen
          }
        />
      </div>
    </li>
  )
}

export default EntryItem
