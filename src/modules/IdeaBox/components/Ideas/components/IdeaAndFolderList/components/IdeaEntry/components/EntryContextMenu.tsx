import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useParams } from 'react-router'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import APIRequest from '@utils/fetchData'

function EntryContextMenu({
  entry
}: {
  entry: IIdeaBoxEntry
}): React.ReactElement {
  const {
    setTypeOfModifyIdea,
    setModifyIdeaModalOpenType,
    setExistedEntry,
    setDeleteIdeaConfirmationModalOpen,
    setEntries
  } = useIdeaBoxContext()

  const { '*': path } = useParams<{ '*': string }>()

  async function pinIdea(): Promise<void> {
    await APIRequest({
      endpoint: `idea-box/ideas/pin/${entry.id}`,
      method: 'POST',
      successInfo: entry.pinned ? 'unpin' : 'pin',
      failureInfo: entry.pinned ? 'unpin' : 'pin',
      callback: res => {
        setEntries(prev =>
          typeof prev !== 'string'
            ? prev
                .map(idea =>
                  idea.id === entry.id ? (res.data as IIdeaBoxEntry) : idea
                )
                .sort((a, b) => {
                  if (a.pinned === b.pinned) {
                    return a.created < b.created ? 1 : -1
                  }
                  return a.pinned ? -1 : 1
                })
            : prev
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
      callback: () => {
        setEntries(prev =>
          typeof prev !== 'string'
            ? prev.filter(idea => idea.id !== entry.id)
            : prev
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
        setEntries(prev =>
          typeof prev !== 'string'
            ? prev.filter(idea => idea.id !== entry.id)
            : prev
        )
      }
    })
  }

  return (
    <Menu as="div" className="absolute right-2 top-2">
      <MenuButton>
        {({ open }) => (
          <div
            className={clsx(
              'shrink-0 rounded-lg bg-bg-50 p-2 text-bg-500 opacity-0 hover:bg-bg-100 hover:text-bg-800 group-hover:opacity-100 dark:bg-bg-800 dark:text-bg-50 dark:hover:bg-bg-700 dark:hover:text-bg-50',
              entry.type === 'image' && 'shadow-custom!',
              open && 'opacity-100!'
            )}
          >
            <Icon className="text-xl" icon="tabler:dots-vertical" />
          </div>
        )}
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="mt-2 min-w-56 overflow-hidden rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
      >
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
        {path !== '' && (
          <MenuItem
            icon="tabler:folder-minus"
            namespace="modules.ideaBox"
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
      </MenuItems>
    </Menu>
  )
}

export default EntryContextMenu
