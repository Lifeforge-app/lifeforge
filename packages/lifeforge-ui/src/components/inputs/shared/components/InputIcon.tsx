import { Icon } from '@iconify/react'
import { memo } from 'react'

import { Box, Text } from '@components/primitives'

import { useInputFocused } from '../contexts/InputFocusContext'

function _InputIcon({
  icon,
  active,
  hasError = false
}: {
  icon: string
  active: boolean
  hasError?: boolean
}) {
  const focused = useInputFocused()

  return (
    <Box
      asChild
      flexShrink="0"
      mx="md"
      style={{
        transition: 'all 0.2s',
        pointerEvents: 'none'
      }}
    >
      <Text
        asChild
        color={
          hasError
            ? 'dangerous'
            : focused
              ? 'custom-500'
              : !active
                ? 'bg-500'
                : undefined
        }
      >
        <Icon height="1.5em" icon={icon} width="1.5em" />
      </Text>
    </Box>
  )
}

export const InputIcon = memo(_InputIcon)
