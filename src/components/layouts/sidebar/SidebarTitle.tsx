import { Icon } from '@iconify/react'
import React from 'react'

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
} & (PropsWithActionButton | PropsWithoutActionButton)

function SidebarTitle({
  name,
  actionButtonIcon,
  actionButtonOnClick
}: SidebarItemProps): React.ReactElement {
  return (
    <li
      className={`flex-between flex gap-4 ${
        actionButtonIcon !== undefined ? 'pb-2' : 'pb-4'
      } pl-8 pr-5 pt-2 transition-all`}
    >
      <h3 className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-bg-600">
        {name}
      </h3>
      {actionButtonIcon !== undefined && (
        <button
          onClick={actionButtonOnClick}
          className="flex items-center rounded-md p-2 text-bg-600 transition-all hover:bg-bg-100 dark:hover:bg-bg-800 dark:hover:text-bg-50"
        >
          <Icon icon={actionButtonIcon} className="size-5" />
        </button>
      )}
    </li>
  )
}

export default SidebarTitle
