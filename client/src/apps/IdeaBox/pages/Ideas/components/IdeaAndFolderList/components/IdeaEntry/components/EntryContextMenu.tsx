import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  type IdeaBoxIdea,
  useIdeaBoxContext
} from '@apps/IdeaBox/providers/IdeaBoxProvider'

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
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry, id, path, viewArchived, debouncedSearchQuery, selectedTags])

  return (
    <HamburgerMenu classNames={{ button: 'w-10 h-10' }}>
      {!entry.archived && (
        <MenuItem
          icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
          text={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={() => {
            pinIdeaMutation.mutate({})
          }}
        />
      )}
      <MenuItem
        icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
        text={entry.archived ? 'Unarchive' : 'Archive'}
        onClick={() => {
          archiveIdeaMutation.mutate({})
        }}
      />
      <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateIdea} />
      {!debouncedSearchQuery && selectedTags.length === 0 && path !== '' && (
        <MenuItem
          icon="tabler:folder-minus"
          namespace="apps.ideaBox"
          text="Remove from folder"
          onClick={() => {
            removeFromFolderMutation.mutate({})
          }}
        />
      )}
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={handleDeleteIdea}
      />
    </HamburgerMenu>
  )
}

export default EntryContextMenu
