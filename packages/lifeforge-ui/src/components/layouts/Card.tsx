import clsx from 'clsx'
import React from 'react'

interface CardBaseProps {
  children: React.ReactNode
  className?: string
  isInteractive?: boolean
}

type CardProps<C extends React.ElementType = 'div'> = {
  as?: C
} & CardBaseProps &
  Omit<React.ComponentProps<C>, keyof CardBaseProps>

function Card<C extends React.ElementType = 'div'>({
  children,
  as,
  className,
  isInteractive,
  ...props
}: CardProps<C>) {
  const Component = as || 'div'

  return (
    <Component
      {...props}
      className={clsx(
        'shadow-custom relative rounded-lg p-4',
        isInteractive
          ? 'component-bg-with-hover cursor-pointer transition-all'
          : 'component-bg',
        !className?.includes('flex') && 'block',
        className
      )}
    >
      {children}
    </Component>
  )
}

export default Card
