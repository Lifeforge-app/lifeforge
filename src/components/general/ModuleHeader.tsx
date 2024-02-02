import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

interface ModuleHeaderPropsWithHamburgerMenu {
  title: string | React.ReactNode
  desc?: string | React.ReactNode
  hasHamburgerMenu?: false
  hamburgerMenuItems?: never
}

interface ModuleHeaderPropsWithHamburgerMenuItems {
  title: string | React.ReactNode
  desc?: string | React.ReactNode
  hasHamburgerMenu?: true
  hamburgerMenuItems?: React.ReactNode
}

type ModuleHeaderProps =
  | ModuleHeaderPropsWithHamburgerMenu
  | ModuleHeaderPropsWithHamburgerMenuItems

function ModuleHeader({
  title,
  desc,
  hasHamburgerMenu = false,
  hamburgerMenuItems
}: ModuleHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
            {title}
          </h1>
          {desc !== undefined && <div className="text-bg-500">{desc}</div>}
        </div>
      </div>
      {hasHamburgerMenu && (
        <Menu as="div" className="relative overscroll-contain">
          <Menu.Button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-900 dark:hover:text-bg-100">
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
            <Menu.Items className="mt-12 w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
              {hamburgerMenuItems}
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </div>
  )
}

export default ModuleHeader
