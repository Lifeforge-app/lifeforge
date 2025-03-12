import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type INotesEntry } from '../../../../../../interfaces/notes_interfaces'

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
}) {
  return (
    <HamburgerMenu>
      <MenuItem
        icon="tabler:pencil"
        text="Rename"
        onClick={() => {
          setModifyFolderModalOpenType('update')
          setExistedData(entry)
        }}
      />
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={() => {
          setDeleteFolderConfirmationModalOpen(true)
          setExistedData(entry)
        }}
      />
    </HamburgerMenu>
  )
}

export default EntryMenu
