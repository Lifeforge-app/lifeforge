import { Icon } from '@iconify/react'
import clsx from 'clsx'

function SidebarItemIcon({
  icon,
  active,
  activeClassName
}: {
  icon?: string | React.ReactElement
  active: boolean
  activeClassName?: string
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
          active && clsx('text-custom-500', activeClassName)
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
          'size-6 shrink-0',
          active && clsx('ring-custom-500 ring-2', activeClassName)
        )}
        src={urlString}
      />
    )
  }

  return (
    <Icon
      className={clsx(
        'size-6 shrink-0',
        active && clsx('text-custom-500', activeClassName)
      )}
      icon={icon}
    />
  )
}

export default SidebarItemIcon
