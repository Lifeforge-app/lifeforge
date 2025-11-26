import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

interface PropsWithActionButton {
  actionButtonIcon: string | undefined
  actionButtonOnClick: (() => void) | undefined
}

interface PropsWithoutActionButton {
  actionButtonIcon?: never
  actionButtonOnClick?: never
}

type SidebarItemProps = {
  label: string
  namespace?: string
  className?: string
  customActionButton?: React.ReactElement
} & (PropsWithActionButton | PropsWithoutActionButton)

function SidebarTitle({
  label,
  className,
  actionButtonIcon,
  actionButtonOnClick,
  customActionButton,
  namespace
}: SidebarItemProps) {
  const { t } = useTranslation([namespace, 'common.sidebar'])

  return (
    <li
      className={clsx(
        'flex-between flex gap-3 pt-2 pr-5 pl-8 transition-all',
        actionButtonIcon !== undefined ? 'pb-2' : 'pb-4'
      )}
    >
      <h3
        className={clsx(
          'text-bg-400 dark:text-bg-600 text-sm font-semibold tracking-widest whitespace-nowrap uppercase',
          className
        )}
      >
        {t([
          `sidebar.${_.camelCase(label)}`,
          `common.sidebar:categories.${_.camelCase(label)}`,
          label
        ])}
      </h3>
      {customActionButton ??
        (actionButtonIcon !== undefined && (
          <button
            className={clsx(
              'text-bg-600 flex items-center rounded-md p-2 transition-all',
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
