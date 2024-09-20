import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ButtonProps {
  children?: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  iconAtEnd?: boolean
  iconSize?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'no-bg'
  isRed?: boolean
  needTranslate?: boolean
  [key: string]: any
}

const generateBaseClass = (hasChildren: boolean, iconAtEnd: boolean): string =>
  `flex items-center justify-center gap-2 whitespace-nowrap rounded-lg p-4 ${
    hasChildren && (iconAtEnd ? 'pl-5' : 'pr-5')
  } font-medium tracking-wide transition-all disabled:cursor-not-allowed`

const generateColorClass = (isRed: boolean, variant: string): string => {
  if (isRed) {
    return variant !== 'no-bg'
      ? 'bg-red-500 hover:bg-red-600 text-bg-50 dark:text-bg-800'
      : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
  }

  switch (variant) {
    case 'primary':
      return 'bg-custom-500 shadow-custom hover:bg-custom-600 text-bg-50 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
    case 'no-bg':
      return 'hover:bg-bg-200/50 dark:hover:bg-bg-800 text-bg-500 hover:text-bg-800 dark:hover:text-bg-50 disabled:bg-bg-100/20 disabled:dark:bg-bg-950 disabled:hover:bg-bg-transparent disabled:dark:hover:bg-bg-950 disabled:hover:text-bg-500 disabled:dark:hover:text-bg-500'
    case 'secondary':
    default:
      return 'bg-bg-300 shadow-custom text-bg-500 dark:text-bg-50 dark:bg-bg-500 hover:bg-bg-400/50 dark:hover:bg-bg-500/80 text-bg-50 dark:text-bg-800 disabled:bg-bg-200 disabled:hover:bg-bg-200 dark:disabled:bg-bg-900 dark:disabled:hover:bg-bg-900 dark:disabled:text-bg-600'
  }
}

const generateClassName = (
  hasChildren: boolean,
  iconAtEnd: boolean,
  isRed: boolean,
  variant: string,
  className: string
): string =>
  `${generateBaseClass(hasChildren, iconAtEnd)} ${generateColorClass(
    isRed,
    variant
  )} ${className}`

const Button: React.FC<ButtonProps> = ({
  children,
  CustomElement,
  icon,
  iconAtEnd = false,
  iconSize,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  isRed = false,
  needTranslate = true,
  ...otherProps
}) => {
  const { t } = useTranslation()
  const FinalElement = CustomElement ?? 'button'
  const finalClassName = generateClassName(
    Boolean(children),
    iconAtEnd,
    isRed,
    variant,
    className
  )

  return (
    <FinalElement
      {...otherProps}
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={finalClassName}
    >
      {!iconAtEnd && (
        <Icon
          icon={loading ? 'svg-spinners:180-ring' : icon}
          className={`shrink-0 ${iconSize ?? 'text-xl'}`}
        />
      )}
      {typeof children === 'string'
        ? children !== ''
          ? needTranslate
            ? t(`button.${toCamelCase(children)}`)
            : children
          : ''
        : children}
      {iconAtEnd && (
        <Icon
          icon={loading ? 'svg-spinners:180-ring' : icon}
          className={`shrink-0 ${iconSize ?? 'text-xl'}`}
        />
      )}
    </FinalElement>
  )
}

export default Button
