import { Icon } from '@iconify/react'
import clsx from 'clsx'

function SidebarItemIcon({
  icon,
  active,
  className
}: {
  icon?: string | React.ReactElement
  active: boolean
  className?: string
}) {
  if (icon === undefined) {
    return null
  }

  if (typeof icon !== 'string') {
    return icon
  }

  if (icon.startsWith('customHTML:')) {
    const htmlString = icon.replace('customHTML:', '')

    return (
      <span
        className={clsx(
          'size-6 shrink-0',
          active && 'text-custom-500',
          className
        )}
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    )
  }

  if (icon.startsWith('url:')) {
    const urlString = icon.replace('url:', '')

    return (
      <img
        className={clsx(
          'size-6 shrink-0 rounded-sm',
          active && clsx('ring-custom-500 ring-2', className)
        )}
        src={urlString}
      />
    )
  }

  return (
    <Icon
      className={clsx(
        'size-6 shrink-0',
        active && clsx('text-custom-500', className)
      )}
      icon={icon}
    />
  )
}

export default SidebarItemIcon
