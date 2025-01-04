import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function TypeSelector({
  inline = false,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  inline?: boolean
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
}): React.ReactElement {
  return (
    <Menu
      as="div"
      className={`relative text-left ${
        inline ? 'hidden sm:inline' : 'mb-8 mt-4 block sm:hidden'
      }`}
    >
      <MenuButton
        className={`flex-between inline-flex w-full rounded-md border-2 border-bg-300 sm:w-auto ${
          inline ? 'p-2 px-4' : 'p-4 px-6'
        } text-lg font-semibold tracking-wide text-bg-800 shadow-sm outline-none hover:bg-bg-100 focus:outline-none dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200`}
      >
        <div className="flex-center">
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
        </div>
        <Icon
          icon="tabler:chevron-down"
          className="-mr-1 ml-2 size-4 stroke-[2px]"
          aria-hidden="true"
        />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom start"
        className="z-[9999] mt-2 w-[var(--button-width)] overflow-hidden rounded-lg bg-bg-100 text-bg-50 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
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
                  setInnerTypeOfModifyIdea(type as 'text' | 'image' | 'link')
                }}
                className={`group flex w-full items-center rounded-md p-4 text-base ${
                  type === innerTypeOfModifyIdea
                    ? ''
                    : active
                    ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-50'
                    : 'text-bg-500 hover:bg-bg-100 dark:text-bg-500 dark:hover:bg-bg-800'
                }`}
              >
                <Icon icon={icon} className="mr-3 size-5" aria-hidden="true" />
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
  )
}

export default TypeSelector
