import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import tinycolor from 'tinycolor2'

import type { IdeaBoxFolder } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ModifyFolderModal from '../../../../modals/ModifyFolderModal'

function FolderContextMenu({
  folder,
  isOver
}: {
  folder: IdeaBoxFolder
  isOver: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleUpdateFolder = useCallback(() => {
    open(ModifyFolderModal, {
      type: 'update',
      initialData: folder
    })
  }, [folder])

  const deleteMutation = useMutation(
    forgeAPI.ideaBox.folders.remove
      .input({
        id: folder.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['ideaBox', 'folders'] })
        },
        onError: error => {
          toast.error(`Failed to delete folder: ${error.message}`)
        }
      })
  )

  const handleDeleteFolder = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Folder',
      description: `Are you sure you want to delete the folder "${folder.name}"? This action cannot be undone.`,
      buttonType: 'delete',
      confirmationPrompt: folder.name,
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
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
    <ContextMenu
      classNames={{
        button: 'p-2!',
        wrapper: 'relative z-10',
        icon: isOver
          ? tinycolor(folder.color).isDark()
            ? 'text-bg-100'
            : 'text-bg-800'
          : 'text-bg-500'
      }}
    >
      {folder.parent !== '' && (
        <ContextMenuItem
          icon="tabler:folder-minus"
          namespace="apps.ideaBox"
          label="Remove from folder"
          onClick={() => removeFromFolderMutation.mutate({})}
        />
      )}
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateFolder}
      />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={handleDeleteFolder}
      />
    </ContextMenu>
  )
}

export default FolderContextMenu
