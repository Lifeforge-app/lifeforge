/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React from 'react'
import { toast } from 'react-toastify'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { type IIdeaBoxEntry } from '@typedec/IdeaBox'

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
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteIdeaModalOpen: (state: boolean) => void
  updateIdeaList: () => void
}): React.ReactElement {
  function pinIdea(ideaId: string): void {
    fetch(`${import.meta.env.VITE_API_HOST}/idea-box/idea/pin/${ideaId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async response => {
        const data = await response.json()

        if (response.status !== 200) {
          throw data.message
        }
        toast.info("Idea's position has been updated.")
        updateIdeaList()
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  function archiveIdea(ideaId: string): void {
    fetch(`${import.meta.env.VITE_API_HOST}/idea-box/idea/archive/${ideaId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async response => {
        const data = await response.json()

        if (response.status !== 200) {
          throw data.message
        }
        toast.info('Idea has been archived.')
        updateIdeaList()
      })
      .catch(() => {
        toast.error('Failed to fetch data from server.')
      })
  }

  return (
    <Menu as="div" className="absolute right-2 top-2">
      <Menu.Button>
        {({ open }) => (
          <div
            className={`shrink-0 rounded-lg bg-bg-50 p-2 text-bg-500 opacity-0 hover:bg-bg-100 hover:text-bg-800 group-hover:opacity-100 dark:bg-bg-800 dark:text-bg-100 dark:hover:bg-bg-700 dark:hover:text-bg-100 ${
              entry.type === 'image' &&
              '!shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]'
            } ${open && '!opacity-100'}`}
          >
            <Icon icon="tabler:dots-vertical" className="text-xl" />
          </div>
        )}
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        className="absolute right-0 top-3 z-[999]"
      >
        <Menu.Items className="mt-6 w-48 overflow-hidden rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
          {!entry.archived && (
            <MenuItem
              onClick={() => {
                pinIdea(entry.id)
              }}
              icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
              text={`${entry.pinned ? 'Unpin from' : 'Pin to'} top`}
            />
          )}
          <MenuItem
            onClick={() => {
              archiveIdea(entry.id)
            }}
            icon={entry.archived ? 'tabler:archive-off' : 'tabler:archive'}
            text={`${entry.archived ? 'Unarchive' : 'Archive'} idea`}
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
          <MenuItem
            onClick={() => {
              setExistedData(entry)
              setDeleteIdeaModalOpen(true)
            }}
            icon="tabler:trash"
            text="Delete"
            isRed
          />
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default EntryContextMenu
