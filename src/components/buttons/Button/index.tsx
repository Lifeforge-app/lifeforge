import { Icon } from '@iconify/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import { generateClassName } from './buttonUtils'

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

type ButtonComponentProps<C extends React.ElementType = 'button'> = {
  as?: C
} & ButtonProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps>

const defaultProps = {
  iconAtEnd: false,
  loading: false,
  disabled: false,
  className: '',
  variant: 'primary',
  isRed: false,
  needTranslate: true
}

const renderIcon = (icon: string, loading: boolean, iconClassName?: string) => (
  <Icon
    icon={loading ? 'svg-spinners:180-ring' : icon}
    className={`shrink-0 text-xl ${iconClassName}`}
  />
)

function Button<C extends React.ElementType = 'button'>({
  as,
  children,
  icon,
  onClick,
  ...props
}: ButtonComponentProps<C>): React.ReactElement {
  const { t } = useTranslation()
  const Component = as || 'button'
  const finalProps = React.useMemo(
    () => ({ ...defaultProps, ...props }),
    [props]
  )
  const finalClassName = generateClassName(
    Boolean(children),
    finalProps.iconAtEnd,
    finalProps.isRed,
    finalProps.variant,
    finalProps.className
  )

  const memoizedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
    },
    [onClick]
  )

  const getTranslatedChildren = () => {
    if (typeof children === 'string' && finalProps.needTranslate) {
      return t(`button.${toCamelCase(children)}`)
    }
    return children
  }

  return (
    <Component
      {...props}
      type="button"
      onClick={memoizedOnClick}
      disabled={finalProps.loading || finalProps.disabled}
      className={finalClassName}
    >
      {!finalProps.iconAtEnd &&
        renderIcon(icon, finalProps.loading, finalProps.iconClassName)}
      {children && getTranslatedChildren()}
      {finalProps.iconAtEnd &&
        renderIcon(icon, finalProps.loading, finalProps.iconClassName)}
    </Component>
  )
}

export default memo(Button) as typeof Button
