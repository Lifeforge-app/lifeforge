import _ from 'lodash'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared/lib'

import { generateClassName } from './buttonUtils'
import ButtonIcon from './components/ButtonIcon'

export interface ButtonProps {
  children?: React.ReactNode
  icon: string
  iconAtEnd?: boolean
  iconClassName?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain'
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

function Button<C extends React.ElementType = 'button'>({
  as,
  children,
  icon,
  onClick,
  ...props
}: ButtonComponentProps<C>) {
  const { derivedThemeColor } = usePersonalization()

  const Component = as || 'button'

  const finalProps = useMemo(() => ({ ...defaultProps, ...props }), [props])

  const finalClassName = generateClassName(
    derivedThemeColor,
    Boolean(children),
    finalProps.iconAtEnd,
    finalProps.isRed,
    finalProps.variant,
    finalProps.className
  )

  const { t } = useTranslation(finalProps.namespace)

  return (
    <Component
      {...props}
      className={finalClassName}
      disabled={finalProps.loading || finalProps.disabled}
      type="button"
      onClick={onClick}
    >
      {!finalProps.iconAtEnd && (
        <ButtonIcon
          disabled={finalProps.disabled}
          icon={icon}
          iconClassName={finalProps.iconClassName}
          loading={finalProps.loading}
        />
      )}
      {children && typeof children === 'string'
        ? t(
            [
              `common.buttons:${_.camelCase(children as string)}`,
              `buttons.${_.camelCase(children as string)}`,
              `${finalProps.tKey}.buttons.${_.camelCase(children as string)}`,
              children
            ],
            finalProps.tProps
          )
        : children}
      {finalProps.iconAtEnd && (
        <ButtonIcon
          disabled={finalProps.disabled}
          icon={icon}
          iconClassName={finalProps.iconClassName}
          loading={finalProps.loading}
        />
      )}
    </Component>
  )
}

export default memo(Button) as typeof Button
