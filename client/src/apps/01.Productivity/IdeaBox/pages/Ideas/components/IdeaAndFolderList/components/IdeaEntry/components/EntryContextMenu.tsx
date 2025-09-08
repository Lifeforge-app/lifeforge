import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, ContextMenu, ContextMenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@apps/01.Productivity/IdeaBox/providers/IdeaBoxProvider'

import ModifyIdeaModal from '../../../../modals/ModifyIdeaModal'

function EntryContextMenu({ entry }: { entry: IdeaBoxIdea }) {
  const open = useModalStore(state => state.open)

  const { viewArchived, debouncedSearchQuery, selectedTags } =
    useIdeaBoxContext()

  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const deleteMutation = useMutation(
    forgeAPI.ideaBox.ideas.remove
      .input({
        id: entry.id
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
    forgeAPI.ideaBox.ideas.pin
      .input({
        id: entry.id
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
    forgeAPI.ideaBox.ideas.archive
      .input({
        id: entry.id
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
    forgeAPI.ideaBox.ideas.removeFromParent
      .input({
        id: entry.id
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

  const handleDeleteIdea = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Idea',
      description: `Are you sure you want to delete this idea? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry, id, path, viewArchived, debouncedSearchQuery, selectedTags])

  return (
    <ContextMenu classNames={{ button: 'w-10 h-10' }}>
      {!entry.archived && (
        <ContextMenuItem
          icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
          label={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={() => {
            pinIdeaMutation.mutate({})
          }}
        />
      )}
      <ContextMenuItem
        icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
        label={entry.archived ? 'Unarchive' : 'Archive'}
        onClick={() => {
          archiveIdeaMutation.mutate({})
        }}
      />
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateIdea}
      />
      {!debouncedSearchQuery && selectedTags.length === 0 && path !== '' && (
        <ContextMenuItem
          icon="tabler:folder-minus"
          label="Remove from folder"
          namespace="apps.ideaBox"
          onClick={() => {
            removeFromFolderMutation.mutate({})
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
