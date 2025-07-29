import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo } from 'react'

function InputIcon({
  icon,
  active,
  isFocused,
  className,
  isListbox = false
}: {
  icon: string
  active: boolean
  isFocused?: boolean
  className?: string
  isListbox?: boolean
}) {
  return (
    <Icon
      className={clsx(
        'group-focus-within:text-custom-500! group-data-open:text-custom-500! size-6 shrink-0 transition-all',
        !active && 'text-bg-400 dark:text-bg-600',
        !isListbox && isFocused && 'text-custom-500',
        className
      )}
      icon={icon}
    />
  )
}

export default memo(InputIcon)
