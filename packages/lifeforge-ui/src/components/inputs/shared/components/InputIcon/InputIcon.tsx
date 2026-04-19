import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo } from 'react'

import { Box } from '@components/primitives'

import {
  inputIconErrorStyle,
  inputIconFocusedStyle,
  inputIconInactiveStyle,
  inputIconPlainVariantStyle
} from './InputIcon.css'

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
    <Box
      asChild
      flexShrink="0"
      style={{
        transition: 'all 0.2s',
        pointerEvents: 'none'
      }}
    >
      <Icon
        className={clsx(
          !active && inputIconInactiveStyle,
          variant === 'plain' && inputIconPlainVariantStyle,
          isFocused && !hasError && inputIconFocusedStyle,
          hasError && inputIconErrorStyle,
          className
        )}
        height="1.5em"
        icon={icon}
        width="1.5em"
      />
    </Box>
  )
}

export default memo(InputIcon)
