import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ButtonProps {
  children?: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  onClick: () => void
  disabled?: boolean
  className?: string
  type?: 'primary' | 'secondary' | 'no-bg'
  isRed?: boolean
}

function generateClassName(
  hasChildren: boolean,
  isRed: boolean,
  type: string,
  className: string
): string {
  const baseClass = `flex items-center justify-center gap-2 rounded-lg p-4 ${
    hasChildren && 'pr-5'
  } font-medium tracking-wide shadow-custom transition-all disabled:cursor-not-allowed`
  let colorClass = ''

  if (isRed) {
    if (type !== 'no-bg') {
      colorClass = 'bg-red-500 hover:bg-red-600 text-bg-100 dark:text-bg-800'
    } else {
      colorClass = 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
    }
  } else if (type === 'primary') {
    colorClass =
      'bg-custom-500 hover:bg-custom-600 text-bg-100 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
  } else if (type === 'no-bg') {
    colorClass =
      'hover:bg-bg-200 dark:hover:bg-bg-800 text-bg-500 hover:text-bg-800 dark:hover:text-bg-100 disabled:bg-bg-100/20 disabled:dark:bg-bg-950 disabled:hover:bg-bg-950 disabled:dark:hover:bg-bg-950 disabled:hover:text-bg-500 disabled:dark:hover:text-bg-500'
  } else {
    colorClass =
      'bg-bg-300 text-bg-500 dark:text-bg-100 dark:bg-bg-500 hover:bg-bg-400/50 dark:hover:bg-bg-500/80 text-bg-100 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
  }

  return `${baseClass} ${colorClass} ${className}`
}

function Button(props: ButtonProps): React.ReactElement {
  const { t } = useTranslation()

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
  const finalClassName = generateClassName(
    Boolean(children),
    isRed,
    type,
    className
  )

  return (
    <FinalElement
      {...otherProps}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      <Icon icon={icon} className="shrink-0 text-xl" />
      {typeof children === 'string'
        ? t(`button.${toCamelCase(children)}`)
        : children ?? ''}
    </FinalElement>
  )
}

export default Button
