import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo } from 'react'

function InputIcon({
  icon,
  active,
  isFocused,
  className,
  isListbox = false,
  hasError = false
}: {
  icon: string
  active: boolean
  isFocused?: boolean
  className?: string
  isListbox?: boolean
  hasError?: boolean
}) {
  return (
    <Icon
      className={clsx(
        'pointer-events-none size-6 shrink-0 transition-all',
        !active && 'text-bg-500',
        !isListbox && isFocused && 'text-custom-500',
        hasError &&
          'text-red-500! group-focus-within:text-red-500! group-data-open:text-red-500!',
        className
      )}
      icon={icon}
    />
  )
}

export default memo(InputIcon)
