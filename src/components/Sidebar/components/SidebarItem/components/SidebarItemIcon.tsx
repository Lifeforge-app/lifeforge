import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function SidebarItemIcon({
  icon,
  active
}: {
  icon?: string
  active: boolean
}): React.ReactElement {
  return (
    <>
      {icon !== undefined && (
        <div className="flex size-7 items-center justify-center">
          <Icon
            icon={icon}
            className={`size-6 shrink-0 ${active ? 'text-custom-500' : ''}`}
          />
        </div>
      )}
    </>
  )
}

export default SidebarItemIcon
