import { memo } from 'react'

import { Box, Icon, Transition } from '@/components/primitives'

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
    <Transition>
      <Box
        asChild
        flexShrink="0"
        mx="md"
        style={{
          pointerEvents: 'none'
        }}
      >
        <Icon
          color={
            hasError
              ? 'dangerous'
              : focused
                ? 'custom-500'
                : !active
                  ? 'bg-500'
                  : undefined
          }
          icon={icon}
          size="1.5em"
        />
      </Box>
    </Transition>
  )
}

export const InputIcon = memo(_InputIcon)
