import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function HamburgerMenu({
  children,
  position,
  lighter,
  largerPadding,
  customWidth,
  customIcon
}: {
  children: React.ReactNode
  position: string
  lighter?: boolean
  largerPadding?: boolean
  customWidth?: string
  customIcon?: string
}): React.ReactElement {
  return (
    <Menu as="div" className={position}>
      <Menu.Button
        className={`rounded-md ${largerPadding === true ? 'p-4' : 'p-2'} ${
          lighter === true
            ? 'text-bg-100 hover:bg-bg-700/50'
            : 'text-bg-500 hover:bg-bg-200/50 hover:text-bg-100 dark:hover:bg-bg-700/30'
        }`}
      >
        <Icon icon={customIcon ?? 'tabler:dots-vertical'} className="h-5 w-5" />
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        className="absolute right-0 top-4 z-50"
      >
        <Menu.Items
          className={`mt-6 ${
            customWidth ?? 'w-48'
          } overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800`}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default HamburgerMenu
