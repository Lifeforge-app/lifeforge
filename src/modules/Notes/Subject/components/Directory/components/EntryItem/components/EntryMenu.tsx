import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import React from 'react'
import { type INotesEntry } from '@interfaces/notes_interfaces'

function EntryMenu({
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
    <HamburgerMenu className="relative">
      <MenuItem
        icon="tabler:pencil"
        onClick={() => {
          setModifyFolderModalOpenType('update')
          setExistedData(entry)
        }}
        text="Rename"
      />
      <MenuItem
        icon="tabler:trash"
        onClick={() => {
          setDeleteFolderConfirmationModalOpen(true)
          setExistedData(entry)
        }}
        text="Delete"
        isRed
      />
    </HamburgerMenu>
  )
}

export default EntryMenu
