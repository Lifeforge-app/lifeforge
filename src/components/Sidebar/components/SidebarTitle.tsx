import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

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
  return (
    <li className="flex items-center justify-between gap-4 py-4 pl-8 pr-5 pt-2 transition-all">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-bg-600">
        {name}
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
