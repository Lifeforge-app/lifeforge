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
  setIdeaList
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
  setIdeaList: React.Dispatch<React.SetStateAction<IIdeaBoxEntry[]>>
}): React.ReactElement {
  const { '*': path } = useParams<{ '*': string }>()

  async function pinIdea(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/ideas/pin/${entry.id}`,
      method: 'POST',
      successInfo: entry.pinned ? 'unpin' : 'pin',
      failureInfo: entry.pinned ? 'unpin' : 'pin',
      callback: res => {
        setIdeaList(prev =>
          prev
            .map(idea =>
              idea.id === entry.id ? (res.data as IIdeaBoxEntry) : idea
            )
            .sort((a, b) => {
              if (a.pinned === b.pinned) {
                return a.created < b.created ? 1 : -1
              }
              return a.pinned ? -1 : 1
            })
        )
      }
    })
  }

  async function archiveIdea(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/ideas/archive/${entry.id}`,
      method: 'POST',
      successInfo: entry.archived ? 'unarchive' : 'archive',
      failureInfo: entry.archived ? 'unarchive' : 'archive',
      callback: res => {
        setIdeaList(prev =>
          prev.filter(idea => idea.id !== entry.id).concat(res.data)
        )
      }
    })
  }

  async function removeFromFolder(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/ideas/move/${entry.id}`,
      method: 'DELETE',
      successInfo: 'remove',
      failureInfo: 'remove',
      callback: () => {
        setIdeaList(prev => prev.filter(idea => idea.id !== entry.id))
      }
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
        className="mt-2 min-w-56 overflow-hidden rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
      >
        {!entry.archived && (
          <MenuItem
            onClick={() => {
              pinIdea().catch(console.error)
            }}
            icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
            text={entry.pinned ? 'Unpin' : 'Pin'}
          />
        )}
        <MenuItem
          onClick={() => {
            archiveIdea().catch(console.error)
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
        {path !== '' && (
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
