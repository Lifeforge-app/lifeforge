import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useParams } from 'react-router'

import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@/providers/IdeaBoxProvider'

import ModifyIdeaModal from '../../../../modals/ModifyIdeaModal'
import MoveToFolderModal from '../../../../modals/MoveToFolderModal'

function EntryContextMenu({ entry }: { entry: IdeaBoxIdea }) {
  const { open } = useModalStore()
  const { viewArchived, searchQuery, selectedTags } = useIdeaBoxContext()
  const queryClient = useQueryClient()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const deleteMutation = useMutation(
    forgeAPI.ideas.remove
      .input({
        id: entry.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
        },
        onError: () => {
          toast.error('Failed to delete idea')
        }
      })
  )

  const pinIdeaMutation = useMutation(
    forgeAPI.ideas.pin
      .input({
        id: entry.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
        },
        onError: () => {
          toast.error(`Failed to ${entry.pinned ? 'unpin' : 'pin'} idea`)
        }
      })
  )

  const archiveIdeaMutation = useMutation(
    forgeAPI.ideas.archive
      .input({
        id: entry.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
        },
        onError: () => {
          toast.error(
            `Failed to ${entry.archived ? 'unarchive' : 'archive'} idea`
          )
        }
      })
  )

  const removeFromFolderMutation = useMutation(
    forgeAPI.ideas.removeFromParent
      .input({
        id: entry.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'ideas']
          })
          queryClient.invalidateQueries({
            queryKey: ['ideaBox', 'misc', 'search']
          })
        },
        onError: () => {
          toast.error('Failed to remove idea from folder')
        }
      })
  )

  const handleUpdateIdea = useCallback(() => {
    open(ModifyIdeaModal, {
      type: 'update',
      initialData: entry
    })
  }, [entry])

  const handleMoveToFolder = useCallback(() => {
    open(MoveToFolderModal, {
      idea: entry
    })
  }, [entry])

  const handleDeleteIdea = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Idea',
      description: `Are you sure you want to delete this idea? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [entry, id, path, viewArchived, searchQuery, selectedTags])

  return (
    <ContextMenu classNames={{ button: 'w-10 h-10' }}>
      {!entry.archived && (
        <ContextMenuItem
          icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
          label={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={() => {
            pinIdeaMutation.mutate(undefined)
          }}
        />
      )}
      <ContextMenuItem
        icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
        label={entry.archived ? 'Unarchive' : 'Archive'}
        onClick={() => {
          archiveIdeaMutation.mutate(undefined)
        }}
      />
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateIdea}
      />
      <ContextMenuItem
        icon="tabler:folder-symlink"
        label="Move to Folder"
        onClick={handleMoveToFolder}
      />
      {!searchQuery && selectedTags.length === 0 && path !== '' && (
        <ContextMenuItem
          icon="tabler:folder-minus"
          label="Remove from folder"
          onClick={() => {
            removeFromFolderMutation.mutate(undefined)
          }}
        />
      )}
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={handleDeleteIdea}
      />
    </ContextMenu>
  )
}

export default EntryContextMenu
