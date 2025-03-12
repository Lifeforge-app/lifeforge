import React from 'react'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { IIdeaBoxFolder } from '../../../../../../../interfaces/ideabox_interfaces'

function FolderContextMenu({
  folder,
  isOver,
  removeFromFolder,
  setModifyFolderModalOpenType,
  setExistedFolder,
  setDeleteFolderConfirmationModalOpen
}: {
  folder: IIdeaBoxFolder
  isOver: boolean
  removeFromFolder: () => Promise<void>
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedFolder: React.Dispatch<React.SetStateAction<IIdeaBoxFolder | null>>
  setDeleteFolderConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <HamburgerMenu
      smallerPadding
      className="relative"
      customHoverColor={`${folder.color}20`}
      style={{ color: !isOver ? folder.color : '' }}
    >
      {folder.parent !== '' && (
        <MenuItem
          icon="tabler:folder-minus"
          namespace="modules.ideaBox"
          text="Remove from folder"
          onClick={() => removeFromFolder().catch(console.error)}
        />
      )}
      <MenuItem
        icon="tabler:pencil"
        text="Edit"
        onClick={() => {
          setModifyFolderModalOpenType('update')
          setExistedFolder(folder)
        }}
      />
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={() => {
          setExistedFolder(folder)
          setDeleteFolderConfirmationModalOpen(true)
        }}
      />
    </HamburgerMenu>
  )
}

export default FolderContextMenu
