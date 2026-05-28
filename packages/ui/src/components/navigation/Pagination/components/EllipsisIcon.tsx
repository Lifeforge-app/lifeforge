import React from 'react'

import { Icon } from '@/components/primitives'
import { Text } from '@/components/primitives'

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
