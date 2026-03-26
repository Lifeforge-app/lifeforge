import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo } from 'react'

import {
  inputIconBaseStyle,
  inputIconErrorStyle,
  inputIconFocusedStyle,
  inputIconInactiveStyle,
  inputIconPlainVariantStyle
} from '../input.css'

function InputIcon({
  icon,
  active,
  isFocused = false,
  className,
  hasError = false,
  variant = 'classic'
}: {
  icon: string
  active: boolean
  isFocused?: boolean
  className?: string
  isListbox?: boolean
  hasError?: boolean
  variant?: 'classic' | 'plain'
}) {
  return (
    <Icon
      className={clsx(
        inputIconBaseStyle,
        !active && inputIconInactiveStyle,
        variant === 'plain' && inputIconPlainVariantStyle,
        isFocused && !hasError && inputIconFocusedStyle,
        hasError && inputIconErrorStyle,
        className
      )}
      icon={icon}
    />
  )
}

export default memo(InputIcon)
