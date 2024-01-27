/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IIdeaBoxContainer } from '../..'

function ContainerGridItem({
  container,
  setCreateContainerModalOpen,
  setExistedData,
  setDeleteContainerConfirmationModalOpen
}: {
  container: IIdeaBoxContainer
  setCreateContainerModalOpen: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IIdeaBoxContainer | null>>
  setDeleteContainerConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <div className="relative flex flex-col items-center justify-start gap-6 rounded-lg bg-neutral-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/70">
      <div
        className="rounded-lg p-4"
        style={{
          backgroundColor: container.color + '20'
        }}
      >
        <Icon
          icon={container.icon}
          className="h-8 w-8"
          style={{
            color: container.color
          }}
        />
      </div>
      <div className="text-center text-2xl font-medium text-neutral-800 dark:text-neutral-100">
        {container.name}
      </div>
      <div className="mt-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="tabler:article" className="h-5 w-5 text-neutral-500" />
          <span className="text-neutral-500">{container.text_count}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="tabler:link" className="h-5 w-5 text-neutral-500" />
          <span className="text-neutral-500">{container.link_count}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="tabler:photo" className="h-5 w-5 text-neutral-500" />
          <span className="text-neutral-500">{container.image_count}</span>
        </div>
      </div>
      <Link
        to={`/idea-box/${container.id}`}
        className="absolute left-0 top-0 h-full w-full"
      />
      <Menu as="div" className="absolute right-4 top-4 overscroll-contain">
        <Menu.Button className="rounded-md p-2 text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-500 dark:hover:bg-neutral-700/30">
          <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
        </Menu.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          className="absolute right-0 top-3"
        >
          <Menu.Items className="mt-8 w-48 overflow-hidden overscroll-contain rounded-md bg-neutral-100 shadow-lg outline-none focus:outline-none dark:bg-neutral-800">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setExistedData(container)
                    setCreateContainerModalOpen('update')
                  }}
                  className={`${
                    active
                      ? 'bg-neutral-200/50 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'
                      : 'text-neutral-500'
                  } flex w-full items-center p-4`}
                >
                  <Icon icon="tabler:edit" className="h-5 w-5" />
                  <span className="ml-2">Edit</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setExistedData(container)
                    setDeleteContainerConfirmationModalOpen(true)
                  }}
                  className={`${
                    active
                      ? 'bg-neutral-200/50 text-red-600 dark:bg-neutral-700'
                      : 'text-red-500'
                  } flex w-full items-center p-4`}
                >
                  <Icon icon="tabler:trash" className="h-5 w-5" />
                  <span className="ml-2">Delete</span>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default ContainerGridItem
