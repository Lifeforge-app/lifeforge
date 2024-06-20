import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ButtonProps {
  children?: React.ReactNode
  CustomElement?: React.ElementType
  icon: string
  iconAtEnd?: boolean
  onClick: () => void
  loading?: boolean
  className?: string
  type?: 'primary' | 'secondary' | 'no-bg'
  isRed?: boolean
}

const generateBaseClass = (hasChildren: boolean, iconAtEnd: boolean): string =>
  `flex items-center justify-center gap-2 rounded-lg p-4 ${
    hasChildren && iconAtEnd ? 'pl-5' : 'pr-5'
  } font-medium tracking-wide shadow-custom transition-all disabled:cursor-not-allowed`

const generateColorClass = (isRed: boolean, type: string): string => {
  if (isRed) {
    return type !== 'no-bg'
      ? 'bg-red-500 hover:bg-red-600 text-bg-100 dark:text-bg-800'
      : 'text-red-500 hover:text-red-600 hover:bg-red-500/10'
  }

  switch (type) {
    case 'primary':
      return 'bg-custom-500 hover:bg-custom-600 text-bg-100 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
    case 'no-bg':
      return 'hover:bg-bg-200 dark:hover:bg-bg-800 text-bg-500 hover:text-bg-800 dark:hover:text-bg-100 disabled:bg-bg-100/20 disabled:dark:bg-bg-950 disabled:hover:bg-bg-950 disabled:dark:hover:bg-bg-950 disabled:hover:text-bg-500 disabled:dark:hover:text-bg-500'
    case 'secondary':
    default:
      return 'bg-bg-300 text-bg-500 dark:text-bg-100 dark:bg-bg-500 hover:bg-bg-400/50 dark:hover:bg-bg-500/80 text-bg-100 dark:text-bg-800 disabled:bg-bg-500 disabled:hover:bg-bg-500'
  }
}

const generateClassName = (
  hasChildren: boolean,
  iconAtEnd: boolean,
  isRed: boolean,
  type: string,
  className: string
): string =>
  `${generateBaseClass(hasChildren, iconAtEnd)} ${generateColorClass(
    isRed,
    type
  )} ${className}`

const Button: React.FC<ButtonProps> = ({
  children,
  CustomElement,
  icon,
  iconAtEnd,
  onClick,
  loading = false,
  className = '',
  type = 'primary',
  isRed = false,
  ...otherProps
}) => {
  const { t } = useTranslation()
  const FinalElement = CustomElement ?? 'button'
  const finalClassName = generateClassName(
    Boolean(children),
    iconAtEnd === true,
    isRed,
    type,
    className
  )

  return (
    <FinalElement
      {...otherProps}
      type="button"
      onClick={onClick}
      disabled={loading}
      className={finalClassName}
    >
      {iconAtEnd !== true && (
        <Icon
          icon={loading ? 'svg-spinners:180-ring' : icon}
          className="shrink-0 text-xl"
        />
      )}
      {typeof children === 'string'
        ? t(`button.${toCamelCase(children)}`)
        : children}
      {iconAtEnd === true && (
        <Icon
          icon={loading ? 'svg-spinners:180-ring' : icon}
          className="shrink-0 text-xl"
        />
      )}
    </FinalElement>
  )
}

export default Button
