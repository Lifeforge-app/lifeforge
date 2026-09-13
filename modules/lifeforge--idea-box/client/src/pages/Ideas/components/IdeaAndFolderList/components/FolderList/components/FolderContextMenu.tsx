import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import tinycolor from 'tinycolor2'

import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { IdeaBoxFolder } from '@/providers/IdeaBoxProvider'

import ModifyFolderModal from '../../../../modals/ModifyFolderModal'

function FolderContextMenu({
  folder,
  isOver
}: {
  folder: IdeaBoxFolder
  isOver: boolean
}) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()

  const handleUpdateFolder = useCallback(() => {
    open(ModifyFolderModal, {
      type: 'update',
      initialData: folder
    })
  }, [folder])

  const deleteMutation = useMutation(
    forgeAPI.folders.remove
      .input({
        id: folder.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'folders']
          })
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
      confirmationButton: 'delete',
      confirmationPrompt: folder.name,
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [folder])

  const removeFromFolderMutation = useMutation(
    forgeAPI.folders.removeFromParent
      .input({
        id: folder.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'folders']
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
          label="Remove from folder"
          onClick={() => removeFromFolderMutation.mutate(undefined)}
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
