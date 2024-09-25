import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function SidebarItemIcon({
  icon,
  active,
  smallIcon
}: {
  icon?: string
  active: boolean
  smallIcon?: React.ReactElement
}): React.ReactElement {
  return (
    <>
      {icon !== undefined && (
        <div className="relative flex size-7 items-center justify-center">
          <Icon
            icon={icon}
            className={`size-6 shrink-0 ${active ? 'text-custom-500' : ''}`}
          />
          {smallIcon}
        </div>
      )}
    </>
  )
}

export default SidebarItemIcon
