import { Icon } from '@iconify/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

interface ButtonProps {
  children?: React.ReactNode
  icon: string
  iconAtEnd?: boolean
  iconClassName?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'no-bg'
  isRed?: boolean
  needTranslate?: boolean
}

interface AsProp<C extends React.ElementType> {
  as?: C
}

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = Record<string, unknown>
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

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
      return 'hover:bg-bg-200/50 dark:hover:bg-bg-800/50 text-bg-500 hover:text-bg-800 dark:hover:text-bg-50 disabled:text-bg-200 disabled:dark:text-bg-600 disabled:!bg-transparent disabled:dark:!bg-transparent disabled:hover:!bg-transparent disabled:dark:hover:!bg-transparent disabled:hover:text-bg-200 disabled:dark:hover:text-bg-600'
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

function Button<C extends React.ElementType = 'button'>({
  as,
  children,
  icon,
  iconAtEnd = false,
  iconClassName,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  variant = 'primary',
  isRed = false,
  needTranslate = true,
  ...otherProps
}: PolymorphicComponentProps<C, ButtonProps>): React.ReactElement {
  const { t } = useTranslation()
  const FinalElement = as ?? 'button'
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
          className={`shrink-0 text-xl ${iconClassName}`}
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
          className={`shrink-0 text-xl ${iconClassName}`}
        />
      )}
    </FinalElement>
  )
}

export default memo(Button)
