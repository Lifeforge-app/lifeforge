import { clsx } from 'clsx'
import { type CSSProperties, type ReactNode } from 'react'

import { Slot } from '@components/primitives'

import { placeholderRecipe } from './Placeholder.css'

interface PlaceholderProps {
  color?: 'transparent' | 'default'
  focusColor?: 'transparent' | 'default'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Placeholder({
  color = 'default',
  focusColor = 'default',
  className,
  style,
  children
}: PlaceholderProps) {
  return (
    <Slot
      className={clsx(placeholderRecipe({ color, focusColor }), className)}
      style={style}
    >
      {children}
    </Slot>
  )
}

