import clsx from 'clsx'
import React from 'react'

function ItemWrapper({
  children,
  as,
  className,
  isInteractive
}: {
  children: React.ReactNode
  as?: React.ElementType
  className?: string
  isInteractive?: boolean
}) {
  const Component = as || 'div'

  return (
    <Component
      className={clsx(
        'shadow-custom relative rounded-lg p-4',
        isInteractive
          ? 'component-bg-with-hover transition-all'
          : 'component-bg',
        className
      )}
    >
      {children}
    </Component>
  )
}

export default ItemWrapper
