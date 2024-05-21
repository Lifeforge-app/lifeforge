import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

export default function IconButton({
  onClick,
  className,
  icon,
  children
}: {
  onClick: () => void
  className: string
  icon: string
  children?: React.ReactNode
}): React.ReactElement {
  return (
    <button onClick={onClick} className={`rounded-lg p-4 ${className}`}>
      <Icon icon={icon} className="text-xl" />
      {children}
    </button>
  )
}
