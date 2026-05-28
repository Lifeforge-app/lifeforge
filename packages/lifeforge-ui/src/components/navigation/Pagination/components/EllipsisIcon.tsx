import { Icon } from '@iconify/react'
import React from 'react'

import { Text } from '@components/primitives'

export function EllipsisIcon() {
  return (
    <Text
      asChild
      color="muted"
      display={{
        base: 'none',
        lg: 'block'
      }}
      mx="sm"
    >
      <Icon icon="uil:ellipsis-h" />
    </Text>
  )
}

