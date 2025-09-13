import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSidebarState } from 'shared'

import { Button, ContextMenu } from '../buttons'
import { useModuleHeaderState } from './ModuleHeaderStateProvider'

interface ModuleHeaderProps {
  icon?: string
  title?: string
  totalItems?: number
  tips?: string
  contextMenuProps?: React.ComponentProps<typeof ContextMenu>
  actionButton?: React.ReactNode
  customElement?: React.ReactNode
  namespace?: string
  tKey?: string
}

function ModuleHeader({
  icon,
  title,
  totalItems,
  tips = '',
  contextMenuProps,
  actionButton,
  customElement,
  namespace,
  tKey
}: ModuleHeaderProps) {
  const { title: innerTitle, icon: innerIcon } = useModuleHeaderState()

  title = title ?? innerTitle
  icon = icon ?? innerIcon

  const { t } = useTranslation([
    `apps.${_.camelCase(title?.toString() ?? '')}`,
    'common.misc',
    namespace ?? ''
  ])

  const { toggleSidebar, sidebarExpanded } = useSidebarState()

  return (
    <header className="flex-between mb-6 flex w-full min-w-0 gap-8">
      <div className="flex w-full min-w-0 items-center gap-2">
        {!sidebarExpanded && (
          <Button
            className="flex sm:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={toggleSidebar}
          />
        )}
        {icon !== undefined && (
          <div className="bg-custom-500/20 flex size-14 shrink-0 items-center justify-center rounded-lg sm:size-16">
            <Icon className="text-custom-500 size-8" icon={icon} />
          </div>
        )}
        <div className="w-full min-w-0 sm:space-y-1">
          <h1 className="flex w-full min-w-0 items-end gap-3 text-2xl font-semibold whitespace-nowrap sm:text-3xl">
            <span className="block truncate">
              {t([
                `${namespace}:${tKey}.${_.camelCase(title?.toString() ?? '')}.title`,
                `${namespace}:${_.camelCase(title?.toString() ?? '')}.title`,
                `apps.${_.camelCase(title?.toString() ?? '')}:title`,
                'common.misc:title',
                'title',
                title?.toString() ?? ''
              ])}
            </span>
            <span className="text-bg-500 min-w-0 text-sm font-medium sm:text-base">
              {totalItems !== undefined
                ? `(${totalItems.toLocaleString()})`
                : ''}
            </span>
          </h1>
          <div className="text-bg-500 w-full min-w-0 truncate text-sm whitespace-nowrap sm:text-base">
            {t([
              `${namespace}:${tKey}.${_.camelCase(title?.toString() ?? '')}.description`,
              `${namespace}:${_.camelCase(title?.toString() ?? '')}.description`,
              `apps.${_.camelCase(title?.toString() ?? '')}:description`,
              'common.misc:description',
              'description',
              `Description for ${title?.toString() ?? ''}`
            ])}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actionButton}
        {tips !== '' && (
          <div className="relative hidden md:block">
            <Menu as="div" className="relative z-50">
              <MenuButton className="text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-900 dark:hover:text-bg-50 rounded-lg p-4 transition-all">
                <Icon className="size-5" icon="tabler:question-circle" />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom end"
                className="bg-bg-100 dark:bg-bg-800 w-96 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
              >
                <div className="text-bg-800 dark:border-bg-700 dark:text-bg-200 flex items-center gap-2 p-4">
                  <Icon className="size-6" icon="tabler:question-circle" />
                  <h2 className="text-lg font-semibold">
                    {t('common.misc:tipsAndTricks')}
                  </h2>
                </div>
                <div className="text-bg-500 p-4 pt-0">{tips}</div>
              </MenuItems>
            </Menu>
          </div>
        )}
        {customElement}
        {contextMenuProps && <ContextMenu {...contextMenuProps} />}
      </div>
    </header>
  )
}

export default ModuleHeader
