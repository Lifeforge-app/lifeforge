import React from 'react'

import { surface } from '@/system/colors/surfaces'

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
      direction="column"
      p="md"
      position="relative"
      r="lg"
      {...(props as FlexProps<T>)}
      bg={{
        ...(isInteractive ? surface.defaultInteractive : surface.default),
        ...props.bg
      }}
      style={{
        ...(isInteractive ? { cursor: 'pointer', transition: 'all 0.2s' } : {}),
        ...style
      }}
    />
  )
}
