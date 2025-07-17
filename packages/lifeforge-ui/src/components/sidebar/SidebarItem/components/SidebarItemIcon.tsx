import { Icon } from '@iconify/react'
import clsx from 'clsx'

function SidebarItemIcon({
  icon,
  active
}: {
  icon?: string | React.ReactElement
  active: boolean
}) {
  return (
    <>
      {icon !== undefined && (
        <>
          {typeof icon === 'string' ? (
            <Icon
              className={clsx('size-6 shrink-0', active && 'text-custom-500')}
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
