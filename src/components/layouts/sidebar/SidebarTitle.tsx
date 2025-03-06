import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface PropsWithActionButton {
  actionButtonIcon: string | undefined
  actionButtonOnClick: (() => void) | undefined
}

interface PropsWithoutActionButton {
  actionButtonIcon?: never
  actionButtonOnClick?: never
}

type SidebarItemProps = {
  name: string
  namespace?: string
  customActionButton?: React.ReactElement
} & (PropsWithActionButton | PropsWithoutActionButton)

function SidebarTitle({
  name,
  actionButtonIcon,
  actionButtonOnClick,
  customActionButton,
  namespace
}: SidebarItemProps): React.ReactElement {
  const { t } = useTranslation([namespace, 'common.sidebar'])

  return (
    <li
      className={clsx(
        'flex-between flex gap-4 pl-8 pr-5 pt-2 transition-all',
        actionButtonIcon !== undefined ? 'pb-2' : 'pb-4'
      )}
    >
      <h3 className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-bg-600">
        {t([
          `sidebar.${toCamelCase(name)}`,
          `common.sidebar:categories.${toCamelCase(name)}`,
          name
        ])}
      </h3>
      {customActionButton ??
        (actionButtonIcon !== undefined && (
          <button
            className={clsx(
              'flex items-center rounded-md p-2 text-bg-600 transition-all',
              'hover:bg-bg-100 dark:hover:bg-bg-800 dark:hover:text-bg-50'
            )}
            onClick={actionButtonOnClick}
          >
            <Icon className="size-5" icon={actionButtonIcon} />
          </button>
        ))}
    </li>
  )
}

export default SidebarTitle
