import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ModuleHeaderProps {
  icon?: string
  title: string | React.ReactNode
  totalItems?: number
  tips?: string
  hamburgerMenuItems?: React.ReactNode
  hamburgerMenuClassName?: string
  actionButton?: React.ReactNode
  customElement?: React.ReactNode
  needTranslate?: boolean
}

function ModuleHeader({
  icon,
  title,
  totalItems,
  tips = '',
  hamburgerMenuItems,
  hamburgerMenuClassName,
  actionButton,
  customElement,
  needTranslate = true
}: ModuleHeaderProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <header className="flex-between flex w-full min-w-0 gap-8">
      <div className="flex w-full min-w-0 items-center gap-4">
        {icon !== undefined && (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-custom-500/20">
            <Icon icon={icon} className="size-8 text-custom-500" />
          </div>
        )}
        <div className="w-full min-w-0 space-y-1">
          <h1 className="flex w-full min-w-0 items-end gap-3 whitespace-nowrap text-3xl font-semibold md:text-4xl">
            <span className="block truncate">
              {needTranslate
                ? t(`modules.${toCamelCase(title?.toString() ?? '')}`)
                : title}
            </span>
            <span className="min-w-0 text-base font-medium text-bg-500">
              {totalItems !== undefined
                ? `(${totalItems.toLocaleString()})`
                : ''}
            </span>
          </h1>
          <div className="w-full min-w-0 truncate whitespace-nowrap text-bg-500">
            {needTranslate
              ? t(
                  `modules.descriptions.${toCamelCase(title?.toString() ?? '')}`
                )
              : ''}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        {tips !== '' && (
          <div className="relative hidden md:block">
            <Menu as="div" className="relative z-50">
              <MenuButton className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-900 dark:hover:text-bg-50">
                <Icon icon="tabler:question-circle" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom end"
                className="w-96 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
              >
                <div className="flex items-center gap-2 p-4 text-bg-800 dark:border-bg-700 dark:text-bg-200">
                  <Icon icon="tabler:question-circle" className="size-6" />
                  <h2 className="text-lg font-semibold">
                    {t('modules.tipsAndTricks')}
                  </h2>
                </div>
                <div className="p-4 pt-0 text-bg-500">{tips}</div>
              </MenuItems>
            </Menu>
          </div>
        )}
        {customElement}
        {hamburgerMenuItems !== undefined && (
          <Menu
            as="div"
            className={`relative z-50 overscroll-contain ${hamburgerMenuClassName}`}
          >
            <MenuButton className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-900 dark:hover:text-bg-50">
              <Icon icon="tabler:dots-vertical" className="size-5" />
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 min-w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
            >
              {hamburgerMenuItems}
            </MenuItems>
          </Menu>
        )}
      </div>
    </header>
  )
}

export default ModuleHeader
