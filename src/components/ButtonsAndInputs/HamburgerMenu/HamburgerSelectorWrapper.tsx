import { Icon } from '@iconify/react'
import React from 'react'

function HamburgerSelectorWrapper({
  icon,
  title,
  children
}: {
  icon: string
  title: string
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <span className="flex items-center gap-4 p-4 text-bg-500">
        <Icon icon={icon} className="size-5" />
        {title}
      </span>
      <div className="p-4 pt-0">
        <ul className="flex flex-col divide-y divide-bg-700 overflow-hidden rounded-md bg-bg-700/50">
          {children}
        </ul>
      </div>
    </>
  )
}

export default HamburgerSelectorWrapper
