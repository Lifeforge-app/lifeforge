import React from 'react'

import { Flex, type FlexProps } from '../../primitives'

export type CardProps<T extends React.ElementType = 'div'> = FlexProps<T> & {
  isInteractive?: boolean
}

export function Card<T extends React.ElementType = 'div'>({
  isInteractive,
  style,
  ...props
}: CardProps<T>) {
  return (
    <Flex
      shadow
      bg={
        isInteractive
          ? {
              base: 'bg-50',
              dark: 'bg-900',
              hover: 'bg-100',
              darkHover: 'bg-800'
            }
          : { base: 'bg-50', dark: 'bg-900' }
      }
      direction="column"
      p="md"
      position="relative"
      rounded="lg"
      style={{
        ...(isInteractive ? { cursor: 'pointer', transition: 'all 0.2s' } : {}),
        ...style
      }}
      {...(props as FlexProps<T>)}
    />
  )
}

