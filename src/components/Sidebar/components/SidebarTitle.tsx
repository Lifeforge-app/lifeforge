import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

interface SidebarItemProps {
  name: string
  actionButtonIcon?: string
}

function SidebarTitle({
  name,
  actionButtonIcon
}: SidebarItemProps): React.JSX.Element {
  return (
    <li className="flex items-center justify-between gap-4 py-4 pl-8 pr-5 pt-2 transition-all">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-600">
        {name}
      </h3>
      <button className="flex items-center rounded-md p-2 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-100">
        <Icon icon={actionButtonIcon} className="h-5 w-5" />
      </button>
    </li>
  )
}

export default SidebarTitle
