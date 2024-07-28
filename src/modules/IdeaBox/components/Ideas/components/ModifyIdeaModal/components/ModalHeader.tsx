/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function ModalHeader({
  innerOpenType,
  setOpenType,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  innerOpenType: 'create' | 'update' | 'paste' | null
  setOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
}): React.ReactElement {
  return (
    <div className="flex-between mb-8 flex w-[50vw]">
      <h1 className="flex items-center gap-3 text-2xl font-semibold">
        <Icon
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil',
              paste: 'tabler:plus'
            }[innerOpenType!]
          }
          className="size-7"
        />
        {
          {
            create: 'New ',
            update: 'Update ',
            paste: 'New '
          }[innerOpenType!]
        }{' '}
        {innerOpenType === 'create' ? (
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="flex-center inline-flex w-full rounded-md border-2 border-bg-300 p-2 px-4 text-lg font-semibold tracking-wide text-bg-800 shadow-sm outline-none hover:bg-bg-200/50 focus:outline-none dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200">
              <Icon
                icon={
                  {
                    text: 'tabler:article',
                    image: 'tabler:photo',
                    link: 'tabler:link'
                  }[innerTypeOfModifyIdea]
                }
                className="mr-2 size-5"
              />
              {innerTypeOfModifyIdea === 'text'
                ? 'Text'
                : innerTypeOfModifyIdea === 'image'
                ? 'Image'
                : 'Link'}
              <Icon
                icon="tabler:chevron-down"
                className="-mr-1 ml-2 size-4 stroke-[2px]"
                aria-hidden="true"
              />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom start"
              className="z-[9999] mt-2 w-56 overflow-hidden rounded-lg bg-bg-100 text-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
            >
              {[
                ['text', 'tabler:article', 'Text'],
                ...[['image', 'tabler:photo', 'Image']],
                ['link', 'tabler:link', 'Link']
              ].map(([type, icon, name]) => (
                <MenuItem key={type}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        setInnerTypeOfModifyIdea(
                          type as 'text' | 'image' | 'link'
                        )
                      }}
                      className={`group flex w-full items-center rounded-md p-4 text-base ${
                        type === innerTypeOfModifyIdea
                          ? ''
                          : active
                          ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-100'
                          : 'text-bg-500 hover:bg-bg-200/50 dark:text-bg-500 dark:hover:bg-bg-800'
                      }`}
                    >
                      <Icon
                        icon={icon}
                        className="mr-3 size-5"
                        aria-hidden="true"
                      />
                      {name}
                      {innerTypeOfModifyIdea === type && (
                        <Icon
                          icon="tabler:check"
                          className="ml-auto size-5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        ) : (
          innerTypeOfModifyIdea[0].toUpperCase() +
          innerTypeOfModifyIdea.slice(1) +
          ' '
        )}
        Idea
      </h1>
      <button
        onClick={() => {
          setOpenType(null)
        }}
        className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 dark:text-bg-100 dark:hover:bg-bg-800"
      >
        <Icon icon="tabler:x" className="size-6" />
      </button>
    </div>
  )
}

export default ModalHeader
