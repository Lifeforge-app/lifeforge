import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '../../../utils/strings'

interface PropsWithActionButton {
  actionButtonIcon: string
  actionButtonOnClick: () => void
}

interface PropsWithoutActionButton {
  actionButtonIcon?: never
  actionButtonOnClick?: never
}

type SidebarItemProps = {
  name: string
} & (PropsWithActionButton | PropsWithoutActionButton)

function SidebarTitle({
  name,
  actionButtonIcon,
  actionButtonOnClick
}: SidebarItemProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <li className="flex items-center justify-between gap-4 py-4 pl-8 pr-5 pt-2 transition-all">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-bg-600">
        {t(`modules.title.${toCamelCase(name)}`)}
      </h3>
      {actionButtonIcon !== undefined && (
        <button
          onClick={actionButtonOnClick}
          className="flex items-center rounded-md p-2 text-bg-600 hover:bg-bg-200/50 dark:hover:bg-bg-800 dark:hover:text-bg-100"
        >
          <Icon icon={actionButtonIcon} className="h-5 w-5" />
        </button>
      )}
    </li>
  )
}

export default SidebarTitle
