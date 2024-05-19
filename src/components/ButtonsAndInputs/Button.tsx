import { Icon } from '@iconify/react'
import React from 'react'

function Button({
  children,
  CustomElement,
  icon,
  onClick,
  disabled,
  className = '',
  type = 'primary',
  isRed = false,
  ...props
}: {
  children: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  type?: 'primary' | 'secondary'
  isRed?: boolean
  [key: string]: any
}): React.ReactElement {
  const FinalElement = CustomElement ?? 'button'

  return (
    <FinalElement
      {...props}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-lg ${
        isRed
          ? 'bg-red-500 hover:bg-red-600'
          : type === 'primary'
          ? 'bg-custom-500 hover:bg-custom-600'
          : 'bg-bg-500 hover:bg-bg-500/80'
      } p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-custom transition-all disabled:cursor-not-allowed disabled:bg-bg-500 disabled:hover:bg-bg-500 dark:text-bg-800 ${className}`}
    >
      <Icon icon={icon} className="text-xl" />
      {children}
    </FinalElement>
  )
}

export default Button
