import { Icon } from '@iconify/react'
import React from 'react'

function SidebarItemIcon({
  icon,
  active
}: {
  icon?: string | React.ReactElement
  active: boolean
}): React.ReactElement {
  return (
    <>
      {icon !== undefined && (
        <>
          {typeof icon === 'string' ? (
            <Icon
              className={`size-6 shrink-0 ${active ? 'text-custom-500' : ''}`}
              icon={icon}
            />
          ) : (
            icon
          )}
        </>
      )}
    </>
  )
}

export default SidebarItemIcon
