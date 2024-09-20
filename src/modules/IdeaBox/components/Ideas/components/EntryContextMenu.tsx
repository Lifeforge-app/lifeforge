import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useParams } from 'react-router'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

function EntryContextMenu({
  entry,
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType,
  setExistedData,
  setDeleteIdeaModalOpen,
  updateIdeaList
}: {
  entry: IIdeaBoxEntry
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  updateIdeaList: () => void
}): React.ReactElement {
  const { folderId } = useParams()
  async function pinIdea(ideaId: string): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/idea/pin/${ideaId}`,
      method: 'POST',
      body: { ideaId },
      successInfo: entry.pinned ? 'unpin' : 'pin',
      failureInfo: entry.pinned ? 'unpin' : 'pin',
      callback: updateIdeaList
    })
  }

  async function archiveIdea(ideaId: string): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/idea/archive/${ideaId}`,
      method: 'POST',
      successInfo: entry.archived ? 'unarchive' : 'archive',
      failureInfo: entry.archived ? 'unarchive' : 'archive',
      callback: updateIdeaList
    })
  }

  async function removeFromFolder(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/folder/idea/${folderId}`,
      method: 'DELETE',
      body: { ideaId: entry.id },
      successInfo: 'remove',
      failureInfo: 'remove',
      callback: updateIdeaList
    })
  }

  return (
    <Menu as="div" className="absolute right-2 top-2">
      <MenuButton>
        {({ open }) => (
          <div
            className={`shrink-0 rounded-lg bg-bg-50 p-2 text-bg-500 opacity-0 hover:bg-bg-100 hover:text-bg-800 group-hover:opacity-100 dark:bg-bg-800 dark:text-bg-50 dark:hover:bg-bg-700 dark:hover:text-bg-50 ${
              entry.type === 'image' ? '!shadow-custom' : ''
            } ${open ? '!opacity-100' : ''}`}
          >
            <Icon icon="tabler:dots-vertical" className="text-xl" />
          </div>
        )}
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="mt-2 w-48 overflow-hidden rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
      >
        {!entry.archived && (
          <MenuItem
            onClick={() => {
              pinIdea(entry.id).catch(console.error)
            }}
            icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
            text={entry.pinned ? 'Unpin' : 'Pin'}
          />
        )}
        <MenuItem
          onClick={() => {
            archiveIdea(entry.id).catch(console.error)
          }}
          icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
          text={entry.archived ? 'Unarchive' : 'Archive'}
        />
        {entry.type !== 'image' && (
          <MenuItem
            onClick={() => {
              setTypeOfModifyIdea(entry.type)
              setExistedData(entry)
              setModifyIdeaModalOpenType('update')
            }}
            icon="tabler:pencil"
            text="Edit"
          />
        )}
        {folderId !== undefined && (
          <MenuItem
            onClick={() => {
              removeFromFolder().catch(console.error)
            }}
            icon="tabler:folder-minus"
            text="Remove from folder"
          />
        )}
        <MenuItem
          onClick={() => {
            setExistedData(entry)
            setDeleteIdeaModalOpen(true)
          }}
          icon="tabler:trash"
          text="Delete"
          isRed
        />
      </MenuItems>
    </Menu>
  )
}

export default EntryContextMenu
