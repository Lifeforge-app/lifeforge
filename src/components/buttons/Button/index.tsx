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
  namespace?: string
  tKey?: string
  tProps?: Record<string, unknown>
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
  namespace: 'common.buttons'
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
  const { t } = useTranslation(finalProps.namespace)

  const memoizedOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
    },
    [onClick]
  )

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
      {children && typeof children === 'string'
        ? t(
            [
              `common.buttons:${toCamelCase(children as string)}`,
              `buttons.${toCamelCase(children as string)}`,
              `${finalProps.tKey}.buttons.${toCamelCase(children as string)}`,
              children
            ],
            finalProps.tProps
          )
        : children}
      {finalProps.iconAtEnd &&
        renderIcon(icon, finalProps.loading, finalProps.iconClassName)}
    </Component>
  )
}

export default memo(Button) as typeof Button
