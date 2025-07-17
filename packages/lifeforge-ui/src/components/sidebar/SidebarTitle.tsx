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
        'flex-between flex gap-3 pl-8 pr-5 pt-2 transition-all',
        actionButtonIcon !== undefined ? 'pb-2' : 'pb-4'
      )}
    >
      <h3 className="text-bg-600 whitespace-nowrap text-sm font-semibold uppercase tracking-widest">
        {t([
          `sidebar.${_.camelCase(name)}`,
          `common.sidebar:categories.${_.camelCase(name)}`,
          name
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
