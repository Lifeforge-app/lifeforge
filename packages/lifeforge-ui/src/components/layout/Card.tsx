import clsx from 'clsx'
import React from 'react'

interface CardBaseProps {
  /** The content to be displayed within the Card component. */
  children: React.ReactNode
  /** Additional CSS class names to apply to the Card component. */
  className?: string
  /** Whether the Card is interactive (e.g., clickable) and should have hover effects. */
  isInteractive?: boolean
}

type CardProps<C extends React.ElementType = 'div'> = {
  as?: C
} & CardBaseProps &
  Omit<React.ComponentProps<C>, keyof CardBaseProps>

/**
 * A versatile Card component that can be rendered as different HTML elements.
 */
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
        'shadow-custom border-bg-500/20 relative rounded-lg p-4 in-[.bordered]:border-2',
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
