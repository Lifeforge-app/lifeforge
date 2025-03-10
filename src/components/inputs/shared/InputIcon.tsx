import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { memo } from 'react'

function InputIcon({
  icon,
  active,
  listboxOrCombobox,
  className
}: {
  icon: string
  active: boolean
  listboxOrCombobox?: 'listbox' | 'combobox'
  className?: string
}): React.ReactElement {
  return (
    <Icon
      className={clsx(
        'group-focus-within:text-custom-500! size-6 shrink-0 transition-all',
        !active && 'text-bg-500',
        listboxOrCombobox !== undefined && 'group-data-open:text-custom-500!',
        className
      )}
      icon={icon}
    />
  )
}

export default memo(InputIcon)
