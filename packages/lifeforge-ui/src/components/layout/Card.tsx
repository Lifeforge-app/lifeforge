import clsx from 'clsx'
import React from 'react'

import { Box, type BoxProps } from '../primitives'
import * as styles from './Card.css'

export interface CardProps extends Omit<
  BoxProps,
  'bg' | 'display' | 'p' | 'position' | 'rounded'
> {
  children: React.ReactNode
  className?: string
  isInteractive?: boolean
}

function Card({
  children,
  className,
  isInteractive,
  style,
  ...props
}: CardProps) {
  return (
    <Box
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
      className={clsx(styles.base, className)}
      display="block"
      p="md"
      position="relative"
      rounded="lg"
      style={{
        ...(isInteractive ? { cursor: 'pointer', transition: 'all 0.2s' } : {}),
        ...style
      }}
      {...props}
    >
      {children}
    </Box>
  )
}

export default Card
