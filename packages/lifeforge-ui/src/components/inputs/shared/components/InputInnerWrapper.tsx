import React from 'react'

import { Flex, type FlexProps } from '@components/primitives'

import type { InputVariant } from '../types'

export function InputInnerWrapper({
  children,
  variant = 'classic',
  hasActionButton = false,
  ...rest
}: {
  children: React.ReactNode
  variant: InputVariant
  hasActionButton?: boolean
} & FlexProps) {
  return (
    <Flex
      align="center"
      gap="sm"
      minWidth="0"
      mr={hasActionButton ? '2xl' : undefined}
      p={variant === 'plain' ? 'xs' : undefined}
      pb={variant === 'classic' ? 'sm' : undefined}
      pl={variant === 'classic' ? 'none' : undefined}
      pr={variant === 'classic' ? 'md' : undefined}
      pt={variant === 'classic' ? 'xl' : undefined}
      width="100%"
      {...rest}
    >
      {children}
    </Flex>
  )
}
