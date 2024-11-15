import { Icon } from '@iconify/react'
import React from 'react'

function SidebarItemIcon({
  icon,
  active,
  iconColor,
  smallIcon
}: {
  icon?: string
  active: boolean
  iconColor?: string
  smallIcon?: React.ReactElement
}): React.ReactElement {
  return (
    <>
      {icon !== undefined && (
        <div className="relative flex size-7 items-center justify-center">
          <Icon
            icon={icon}
            className={`size-6 shrink-0 ${
              iconColor === undefined && (active ? 'text-custom-500' : '')
            }`}
            style={iconColor !== undefined ? { color: iconColor } : {}}
          />
          {smallIcon}
        </div>
      )}
    </>
  )
}

export default SidebarItemIcon
