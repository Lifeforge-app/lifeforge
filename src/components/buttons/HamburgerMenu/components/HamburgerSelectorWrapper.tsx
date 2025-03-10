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
      <span className="text-bg-500 flex items-center gap-4 p-4">
        <Icon className="size-5" icon={icon} />
        {title}
      </span>
      <div className="p-4 pt-0">
        <ul className="divide-bg-700 bg-bg-700/50 flex flex-col divide-y overflow-hidden rounded-md">
          {children}
        </ul>
      </div>
    </>
  )
}

export default HamburgerSelectorWrapper
