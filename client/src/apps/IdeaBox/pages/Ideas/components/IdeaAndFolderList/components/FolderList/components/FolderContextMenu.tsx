import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useParams } from 'react-router'

import type { IdeaBoxFolder } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ModifyFolderModal from '../../../../modals/ModifyFolderModal'

function FolderContextMenu({
  folder
  // isOver,
}: {
  folder: IdeaBoxFolder
  isOver: boolean
}) {
  // console.log(isOver) //TODO
  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const open = useModalStore(state => state.open)

  const handleUpdateFolder = useCallback(() => {
    open(ModifyFolderModal, {
      type: 'update',
      initialData: folder
    })
  }, [folder])

  const handleDeleteFolder = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'idea-box/folders',
      confirmationText: 'Delete this folder',
      data: folder,
      itemName: 'folder',
      queryKey: ['idea-box', 'folders', id!, path!]
    })
  }, [folder])

  const removeFromFolderMutation = useMutation(
    forgeAPI.ideaBox.folders.removeFromParent
      .input({
        id: folder.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['idea-box', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['idea-box', 'misc', 'search']
          })
          queryClient.invalidateQueries({
            queryKey: ['idea-box', 'folders']
          })
        },
        onError: () => {}
      })
  )

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
          onClick={() => removeFromFolderMutation.mutate({})}
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
