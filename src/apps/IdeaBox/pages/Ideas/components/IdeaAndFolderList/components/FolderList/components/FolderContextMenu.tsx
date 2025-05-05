import { useCallback } from 'react'
import { useParams } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IIdeaBoxFolder } from '../../../../../../../interfaces/ideabox_interfaces'

function FolderContextMenu({
  folder,
  // isOver,
  removeFromFolder
}: {
  folder: IIdeaBoxFolder
  isOver: boolean
  removeFromFolder: () => Promise<void>
}) {
  // console.log(isOver) //TODO
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const open = useModalStore(state => state.open)

  const handleUpdateFolder = useCallback(() => {
    open('ideaBox.ideas.modifyFolder', {
      type: 'update',
      existedData: folder
    })
  }, [folder])

  const handleDeleteFolder = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'idea-box/folders',
      confirmationText: 'Delete this folder',
      data: folder,
      itemName: 'folder',
      queryKey: ['idea-box', 'folders', id!, path!]
    })
  }, [folder])

  return (
    <HamburgerMenu
      classNames={{
        button: 'p-2!',
        wrapper: 'relative z-10'
      }}
    >
      {folder.parent !== '' && (
        <MenuItem
          icon="tabler:folder-minus"
          namespace="apps.ideaBox"
          text="Remove from folder"
          onClick={() => removeFromFolder().catch(console.error)}
        />
      )}
      <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateFolder} />
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={handleDeleteFolder}
      />
    </HamburgerMenu>
  )
}

export default FolderContextMenu
