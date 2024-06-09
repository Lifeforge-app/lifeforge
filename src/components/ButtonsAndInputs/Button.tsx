import { Icon } from '@iconify/react'
import React from 'react'

interface ButtonProps {
  children?: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  onClick: () => void
  disabled?: boolean
  className?: string
  type?: 'primary' | 'secondary'
  isRed?: boolean
}

function generateClassName(
  isRed: boolean,
  type: string,
  className: string
): string {
  const baseClass =
    'flex items-center justify-center gap-2 rounded-lg p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-custom transition-all disabled:cursor-not-allowed disabled:bg-bg-500 disabled:hover:bg-bg-500 dark:text-bg-800'
  let colorClass = ''

  if (isRed) {
    colorClass = 'bg-red-500 hover:bg-red-600'
  } else if (type === 'primary') {
    colorClass = 'bg-custom-500 hover:bg-custom-600'
  } else {
    colorClass =
      'bg-bg-300 text-bg-500 dark:text-bg-100 dark:bg-bg-500 hover:bg-bg-400/50 dark:hover:bg-bg-500/80'
  }

  return `${baseClass} ${colorClass} ${className}`
}

function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    CustomElement,
    icon,
    onClick,
    disabled,
    className = '',
    type = 'primary',
    isRed = false,
    ...otherProps
  } = props

  const FinalElement = CustomElement ?? 'button'
  const finalClassName = generateClassName(isRed, type, className)

  return (
    <FinalElement
      {...otherProps}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      <Icon icon={icon} className="shrink-0 text-xl" />
      {children ?? ''}
    </FinalElement>
  )
}

export default Button
