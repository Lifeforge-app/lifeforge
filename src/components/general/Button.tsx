import { Icon } from '@iconify/react'
import React from 'react'

function Button({
  children,
  CustomElement,
  icon,
  onClick,
  disabled,
  className = '',
  type = 'primary'
}: {
  children: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  type?: 'primary' | 'secondary'
}): React.ReactElement {
  const FinalElement = CustomElement ?? 'button'

  return (
    <FinalElement
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-lg ${
        type === 'primary'
          ? 'bg-custom-500 hover:bg-custom-600'
          : 'bg-bg-500 hover:bg-bg-500/80'
      } p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all disabled:cursor-not-allowed disabled:bg-bg-500 disabled:hover:bg-bg-500 dark:text-bg-800 ${className}`}
    >
      <Icon icon={icon} className="text-xl" />
      {children}
    </FinalElement>
  )
}

export default Button
