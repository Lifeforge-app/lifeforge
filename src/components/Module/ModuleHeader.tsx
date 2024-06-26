import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ModuleHeaderPropsWithHamburgerMenu {
  title: string | React.ReactNode
  desc?: string | React.ReactNode
  hasHamburgerMenu?: false
  hamburgerMenuItems?: never
  actionButton?: React.ReactNode
}

interface ModuleHeaderPropsWithHamburgerMenuItems {
  title: string | React.ReactNode
  desc?: string | React.ReactNode
  hasHamburgerMenu: true
  hamburgerMenuItems: React.ReactNode
  actionButton?: React.ReactNode
}

type ModuleHeaderProps =
  | ModuleHeaderPropsWithHamburgerMenu
  | ModuleHeaderPropsWithHamburgerMenuItems

function ModuleHeader({
  title,
  desc,
  hasHamburgerMenu = false,
  hamburgerMenuItems,
  actionButton
}: ModuleHeaderProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="flex flex-between gap-8">
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <h1 className="flex items-center gap-3 text-3xl font-semibold  md:text-4xl">
            {t(`modules.${toCamelCase(title?.toString() ?? '')}`)}
          </h1>
          {desc !== undefined && (
            <div className="text-bg-500">
              {t(
                `modules.descriptions.${toCamelCase(title?.toString() ?? '')}`
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        {hasHamburgerMenu && (
          <Menu as="div" className="relative z-50 overscroll-contain">
            <Menu.Button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-900 dark:hover:text-bg-100">
              <Icon icon="tabler:dots-vertical" className="size-5" />
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
              <Menu.Items className="mt-12 min-w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
                {hamburgerMenuItems}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  )
}

export default ModuleHeader
