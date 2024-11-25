import { Icon } from '@iconify/react/dist/iconify.js'
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
      className={`ml-6 size-6 shrink-0 ${
        active ? '' : 'text-bg-500'
      } group-focus-within:!text-custom-500`}
    />
  )
}

export default InputIcon
