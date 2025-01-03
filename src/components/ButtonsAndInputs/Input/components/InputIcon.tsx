import { Icon } from '@iconify/react'
import React from 'react'

function InputIcon({
  icon,
  active
}: {
  icon: string
  active: boolean
}): React.ReactElement {
  return (
    <Icon
      icon={icon}
      className={`size-6 shrink-0 ${
        active ? '' : 'text-bg-500'
      } transition-all group-focus-within:!text-custom-500`}
    />
  )
}

export default InputIcon
