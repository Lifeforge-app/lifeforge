import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { memo } from 'react'

function InputIcon({
  icon,
  active,
  isListbox,
  className
}: {
  icon: string
  active: boolean
  isListbox?: boolean
  className?: string
}): React.ReactElement {
  return (
    <Icon
      className={clsx(
        'size-6 shrink-0 transition-all',
        !active && 'text-bg-500',
        isListbox === true
          ? 'group-data-open:text-custom-500!'
          : 'group-focus-within:text-custom-500!',
        className
      )}
      icon={icon}
    />
  )
}

export default memo(InputIcon)
