import { Icon } from '@iconify/react'
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
} & (PropsWithActionButton | PropsWithoutActionButton)

function SidebarTitle({
  name,
  actionButtonIcon,
  actionButtonOnClick,
  namespace
}: SidebarItemProps): React.ReactElement {
  const { t } = useTranslation([namespace, 'common.sidebar'])

  return (
    <li
      className={`flex-between flex gap-4 ${
        actionButtonIcon !== undefined ? 'pb-2' : 'pb-4'
      } pl-8 pr-5 pt-2 transition-all`}
    >
      <h3 className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-bg-600">
        {t([
          `sidebar.${toCamelCase(name)}`,
          `common.sidebar:categories.${toCamelCase(name)}`,
          name
        ])}
      </h3>
      {actionButtonIcon !== undefined && (
        <button
          className="flex items-center rounded-md p-2 text-bg-600 transition-all hover:bg-bg-100 dark:hover:bg-bg-800 dark:hover:text-bg-50"
          onClick={actionButtonOnClick}
        >
          <Icon className="size-5" icon={actionButtonIcon} />
        </button>
      )}
    </li>
  )
}

export default SidebarTitle
