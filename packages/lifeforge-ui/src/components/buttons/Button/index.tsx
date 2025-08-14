import _ from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import { generateClassName } from './buttonUtils'
import ButtonIcon from './components/ButtonIcon'

export interface ButtonProps {
  children?: React.ReactNode
  icon: string
  iconPosition?: 'start' | 'end'
  iconClassName?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain'
  isRed?: boolean
  namespace?: string
  tProps?: Record<string, unknown>
}

type ButtonComponentProps<C extends React.ElementType = 'button'> = {
  as?: C
} & ButtonProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps>

const defaultProps = {
  iconPosition: 'start',
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
    finalProps.iconPosition === 'end',
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
      {finalProps.iconPosition === 'start' && (
        <ButtonIcon
          disabled={finalProps.disabled}
          icon={icon}
          iconClassName={finalProps.iconClassName}
          loading={finalProps.loading}
        />
      )}

      {children && typeof children === 'string' ? (
        <div className="min-w-0 truncate">
          {t(
            [
              `${_.camelCase(children)}`,
              `buttons.${_.camelCase(children)}`,
              `common.buttons:${_.camelCase(children)}`,
              children
            ],
            finalProps.tProps
          )}
        </div>
      ) : (
        children
      )}
      {finalProps.iconPosition === 'end' && (
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

export default Button
