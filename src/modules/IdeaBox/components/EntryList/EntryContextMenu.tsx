/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { type IIdeaBoxEntry } from './Ideas'
import { toast } from 'react-toastify'

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
      method: 'POST'
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

  return (
    <Menu
      as="div"
      className={`${
        entry.type === 'image' ? 'absolute right-2 top-2' : 'relative'
      } z-[999]`}
    >
      <Menu.Button>
        {({ open }) => (
          <div
            className={`shrink-0 rounded-lg bg-neutral-800/50 p-2 text-neutral-100 opacity-0 hover:bg-neutral-900 hover:text-neutral-100 group-hover:opacity-100 ${
              open &&
              `${
                entry.type === 'image' ? '!bg-neutral-900' : '!bg-neutral-800'
              } !opacity-100`
            }`}
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
        className="absolute right-0 top-3"
      >
        <Menu.Items className="mt-8 w-48 overflow-hidden rounded-md bg-neutral-800 shadow-lg outline-none focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => {
                  pinIdea(entry.id)
                }}
                className={`${
                  active
                    ? 'bg-neutral-700/50 text-neutral-100'
                    : 'text-neutral-500'
                } group flex w-full items-center gap-4 rounded-md p-4`}
              >
                <Icon
                  icon={entry.pinned ? 'tabler:pinned-off' : 'tabler:pin'}
                  className={`${
                    active ? 'text-neutral-100' : 'text-neutral-500'
                  } h-5 w-5`}
                />
                {entry.pinned ? 'Unpin from' : 'Pin to'} top
              </button>
            )}
          </Menu.Item>
          {entry.type !== 'image' && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setTypeOfModifyIdea(entry.type)
                    setExistedData(entry)
                    setModifyIdeaModalOpenType('update')
                  }}
                  className={`${
                    active
                      ? 'bg-neutral-700/50 text-neutral-100'
                      : 'text-neutral-500'
                  } group flex w-full items-center gap-4 rounded-md p-4`}
                >
                  <Icon
                    icon="tabler:pencil"
                    className={`${
                      active ? 'text-neutral-100' : 'text-neutral-500'
                    } h-5 w-5`}
                  />
                  Edit
                </button>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => {
                  setExistedData(entry)
                  setDeleteIdeaModalOpen(true)
                }}
                className={`${
                  active ? 'bg-neutral-700/50 text-red-600' : ' text-red-500'
                } group flex w-full items-center gap-4 rounded-md p-4`}
              >
                <Icon icon="tabler:trash" className="h-5 w-5" />
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default EntryContextMenu
