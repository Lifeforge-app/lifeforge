import clsx from 'clsx'
import React from 'react'

interface ItemWrapperBaseProps {
  children: React.ReactNode
  className?: string
  isInteractive?: boolean
}

type ItemWrapperProps<C extends React.ElementType = 'div'> = {
  as?: C
} & ItemWrapperBaseProps &
  Omit<React.ComponentProps<C>, keyof ItemWrapperBaseProps>

function ItemWrapper<C extends React.ElementType = 'div'>({
  children,
  as,
  className,
  isInteractive,
  ...props
}: ItemWrapperProps<C>) {
  const Component = as || 'div'

  return (
    <Component
      {...props}
      className={clsx(
        'shadow-custom relative overflow-hidden rounded-lg p-4',
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

export default ItemWrapper
