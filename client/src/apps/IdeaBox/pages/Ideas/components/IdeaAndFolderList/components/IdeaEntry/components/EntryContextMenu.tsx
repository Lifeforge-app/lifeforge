import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ModifyIdeaModal from '../../../../modals/ModifyIdeaModal'

function EntryContextMenu({
  entry
}: {
  entry:
    | IdeaBoxControllersSchemas.IIdeas['getIdeas']['response'][number]
    | IdeaBoxControllersSchemas.IMisc['search']['response'][number]
}) {
  const open = useModalStore(state => state.open)

  const { viewArchived, debouncedSearchQuery, selectedTags } =
    useIdeaBoxContext()

  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const handlePinIdea = useCallback(async () => {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/ideas/pin/${entry.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas']
      })

      queryClient.invalidateQueries({
        queryKey: [
          'idea-box',
          'search',
          id,
          path,
          selectedTags,
          debouncedSearchQuery
        ]
      })
    } catch {
      toast.error(`Failed to ${entry.pinned ? 'unpin' : 'pin'} idea`)
    }
  }, [entry, id, path, viewArchived])

  const handleArchiveIdea = useCallback(async () => {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/ideas/archive/${entry.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas']
      })
      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'search']
      })
    } catch {
      toast.error(`Failed to ${entry.archived ? 'unarchive' : 'archive'} idea`)
    }
  }, [entry, id, path])

  const handleRemoveFromFolder = useCallback(async () => {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `idea-box/ideas/move/${entry.id}`,
        {
          method: 'DELETE'
        }
      )

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id!, path!]
      })
    } catch {
      toast.error('Failed to remove idea from folder')
    }
  }, [entry, id, path])

  const handleUpdateIdea = useCallback(() => {
    open(ModifyIdeaModal, {
      type: 'update',
      ideaType: entry.type,
      existedData: entry
    })
  }, [entry])

  const handleDeleteIdea = useCallback(() => {
    open(DeleteConfirmationModal, {
      multiQueryKey: true,
      apiEndpoint: 'idea-box/ideas',
      data: entry,
      itemName: 'idea',
      queryKey: [
        ['idea-box', 'search', id, path, selectedTags, debouncedSearchQuery],
        ['idea-box', 'ideas', id!, path!, viewArchived]
      ]
    })
  }, [entry, id, path, viewArchived, debouncedSearchQuery, selectedTags])

  return (
    <HamburgerMenu classNames={{ button: 'w-10 h-10' }}>
      {!entry.archived && (
        <MenuItem
          icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
          text={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={handlePinIdea}
        />
      )}
      <MenuItem
        icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
        text={entry.archived ? 'Unarchive' : 'Archive'}
        onClick={handleArchiveIdea}
      />
      <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateIdea} />
      {!debouncedSearchQuery && selectedTags.length === 0 && path !== '' && (
        <MenuItem
          icon="tabler:folder-minus"
          namespace="apps.ideaBox"
          text="Remove from folder"
          onClick={handleRemoveFromFolder}
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
