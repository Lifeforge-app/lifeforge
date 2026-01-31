import clsx from 'clsx'
import React from 'react'

import { Slot } from '../primitives/Slot'

export interface CardBaseProps {
  children: React.ReactNode
  className?: string
  isInteractive?: boolean
  asChild?: boolean
}

export type CardProps<C extends React.ElementType = 'div'> = {
  as?: C
  ref?: React.ComponentPropsWithRef<C>['ref']
} & CardBaseProps &
  Omit<React.ComponentProps<C>, keyof CardBaseProps | 'as'>

function Card<C extends React.ElementType = 'div'>({
  children,
  as,
  asChild = false,
  className,
  isInteractive,
  ref,
  ...props
}: CardProps<C>) {
  const cardClassName = clsx(
    'shadow-custom border-bg-500/20 relative rounded-lg p-4 in-[.bordered]:border-2',
    isInteractive
      ? 'component-bg-with-hover cursor-pointer transition-all'
      : 'component-bg',
    !className?.includes('flex') && 'block',
    className
  )

  const Component = asChild ? Slot : as || 'div'

  return (
    <Component ref={ref} {...props} className={cardClassName}>
      {children}
    </Component>
  )
}

export default Card
