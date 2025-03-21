import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import fetchAPI from '@utils/fetchAPI'

import { type IIdeaBoxEntry } from '../../../../../../../interfaces/ideabox_interfaces'

function EntryContextMenu({ entry }: { entry: IIdeaBoxEntry }) {
  const {
    setTypeOfModifyIdea,
    setModifyIdeaModalOpenType,
    setExistedEntry,
    setDeleteIdeaConfirmationModalOpen,
    viewArchived,
    debouncedSearchQuery,
    selectedTags
  } = useIdeaBoxContext()
  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  async function pinIdea() {
    try {
      await fetchAPI(`idea-box/ideas/pin/${entry.id}`, {
        method: 'POST'
      })

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id!, path!, viewArchived]
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
  }

  async function archiveIdea() {
    try {
      await fetchAPI(`idea-box/ideas/archive/${entry.id}`, {
        method: 'POST'
      })

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id!, path!, viewArchived]
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
      toast.error(`Failed to ${entry.archived ? 'unarchive' : 'archive'} idea`)
    }
  }

  async function removeFromFolder() {
    try {
      await fetchAPI(`idea-box/ideas/move/${entry.id}`, {
        method: 'DELETE'
      })

      queryClient.invalidateQueries({
        queryKey: ['idea-box', 'ideas', id!, path!, viewArchived]
      })
    } catch {
      toast.error('Failed to remove idea from folder')
    }
  }

  return (
    <HamburgerMenu classNames={{ wrapper: 'absolute right-2 top-2' }}>
      {!entry.archived && (
        <MenuItem
          icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
          text={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={() => {
            pinIdea().catch(console.error)
          }}
        />
      )}
      <MenuItem
        icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
        text={entry.archived ? 'Unarchive' : 'Archive'}
        onClick={() => {
          archiveIdea().catch(console.error)
        }}
      />
      <MenuItem
        icon="tabler:pencil"
        text="Edit"
        onClick={() => {
          setTypeOfModifyIdea(entry.type)
          setExistedEntry(entry)
          setModifyIdeaModalOpenType('update')
        }}
      />
      {!debouncedSearchQuery && selectedTags.length === 0 && path !== '' && (
        <MenuItem
          icon="tabler:folder-minus"
          namespace="apps.ideaBox"
          text="Remove from folder"
          onClick={() => {
            removeFromFolder().catch(console.error)
          }}
        />
      )}
      <MenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={() => {
          setExistedEntry(entry)
          setDeleteIdeaConfirmationModalOpen(true)
        }}
      />
    </HamburgerMenu>
  )
}

export default EntryContextMenu
