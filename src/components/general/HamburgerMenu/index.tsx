import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function HamburgerMenu({
  children,
  position
}: {
  children: React.ReactNode
  position: string
}): React.ReactElement {
  return (
    <Menu as="div" className={position}>
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
        className="absolute right-0 top-3 z-50"
      >
        <Menu.Items className="mt-8 w-48 overflow-hidden overscroll-contain rounded-md bg-neutral-100 shadow-lg outline-none focus:outline-none dark:bg-neutral-800">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default HamburgerMenu
