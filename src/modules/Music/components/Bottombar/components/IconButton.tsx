import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

export default function IconButton({
  onClick,
  className,
  icon,
  children
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  icon: string
  children?: React.ReactNode
}): React.ReactElement {
  return (
    <button className={clsx('rounded-lg p-4', className)} onClick={onClick}>
      <Icon className="text-xl" icon={icon} />
      {children}
    </button>
  )
}
