/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function ModalHeader({
  innerOpenType,
  setOpenType,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  innerOpenType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
}): React.ReactElement {
  return (
    <div className="mb-8 flex w-[50vw] items-center justify-between">
      <h1 className="flex items-center gap-3 text-2xl font-semibold">
        <Icon
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }
          className="h-7 w-7"
        />
        {
          {
            create: 'New ',
            update: 'Update '
          }[innerOpenType!]
        }{' '}
        {innerOpenType === 'create' ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex w-full items-center justify-center rounded-md border-2 border-bg-300 p-2 px-4 text-lg font-semibold tracking-wide text-bg-800 shadow-sm outline-none hover:bg-bg-200/50 focus:outline-none dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200">
              <Icon
                icon={
                  {
                    text: 'tabler:article',
                    image: 'tabler:photo',
                    link: 'tabler:link'
                  }[innerTypeOfModifyIdea]
                }
                className="mr-2 h-5 w-5"
              />
              {innerTypeOfModifyIdea === 'text'
                ? 'Text'
                : innerTypeOfModifyIdea === 'image'
                ? 'Image'
                : 'Link'}
              <Icon
                icon="tabler:chevron-down"
                className="-mr-1 ml-2 h-4 w-4 stroke-[2px]"
                aria-hidden="true"
              />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              className="absolute left-0 z-[999] mt-2"
            >
              <Menu.Items className="w-56 overflow-hidden rounded-lg bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
                {[
                  ['text', 'tabler:article', 'Text'],
                  ...[['image', 'tabler:photo', 'Image']],
                  ['link', 'tabler:link', 'Link']
                ].map(([type, icon, name]) => (
                  <Menu.Item key={type}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setInnerTypeOfModifyIdea(
                            type as 'text' | 'image' | 'link'
                          )
                        }}
                        className={`group flex w-full items-center rounded-md p-4 text-base ${
                          type === innerTypeOfModifyIdea
                            ? 'text-bg-800 dark:text-bg-100'
                            : active
                            ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-100'
                            : 'text-bg-500 hover:bg-bg-200/50 dark:text-bg-500 dark:hover:bg-bg-800'
                        }`}
                      >
                        <Icon
                          icon={icon}
                          className="mr-3 h-5 w-5"
                          aria-hidden="true"
                        />
                        {name}
                        {innerTypeOfModifyIdea === type && (
                          <Icon
                            icon="tabler:check"
                            className="ml-auto h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
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
        <Icon icon="tabler:x" className="h-6 w-6" />
      </button>
    </div>
  )
}

export default ModalHeader
