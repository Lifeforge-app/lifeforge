/* eslint-disable @typescript-eslint/indent */
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function FAB({
  setTypeOfModifyIdea,
  setModifyIdeaModalOpenType
}: {
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'link' | 'image' | 'text'>
  >
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}): React.ReactElement {
  return (
    <Menu
      as="div"
      className="group fixed bottom-12 right-12 z-[9990] overscroll-contain "
    >
      <Menu.Button className="flex items-center gap-2 rounded-lg bg-teal-500 p-4 font-semibold uppercase tracking-wider text-neutral-100 shadow-lg hover:bg-teal-600 dark:text-neutral-800">
        {({ open }) => (
          <Icon
            icon="tabler:plus"
            className={`h-6 w-6 shrink-0 transition-all ${open && 'rotate-45'}`}
          />
        )}
      </Menu.Button>
      <Transition
        enter="transition-all ease-out duration-300 overflow-hidden"
        enterFrom="max-h-0"
        enterTo="max-h-96"
        leave="transition-all ease-in duration-200 overflow-hidden"
        leaveFrom="max-h-96"
        leaveTo="max-h-0"
        className="absolute bottom-0 right-0 -translate-y-16 overflow-hidden"
      >
        <Menu.Items className="mt-2 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="py-1">
            {[
              ['Text', 'tabler:text-size'],
              ['Link', 'tabler:link'],
              ['Image', 'tabler:photo']
            ].map(([name, icon]) => (
              <Menu.Item key={name}>
                {({ active }) => (
                  <button
                    onClick={() => {
                      setTypeOfModifyIdea(
                        name.toLowerCase() as 'text' | 'image' | 'link'
                      )
                      setModifyIdeaModalOpenType('create')
                    }}
                    className={`group flex w-full items-center justify-end gap-4 rounded-md py-3 pr-2 ${
                      active
                        ? 'text-neutral-800 dark:text-neutral-200'
                        : 'text-neutral-500 dark:text-neutral-100'
                    }`}
                  >
                    {name}
                    <button
                      className={`rounded-full ${
                        active ? 'bg-neutral-300' : 'bg-neutral-200'
                      } p-3`}
                    >
                      <Icon
                        icon={icon}
                        className={`h-5 w-5 text-neutral-800 ${
                          active && 'text-neutral-300'
                        }`}
                      />
                    </button>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default FAB
