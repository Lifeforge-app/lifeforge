/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import { generateClassName } from './buttonUtils'
import ButtonIcon from './components/ButtonIcon'

export interface ButtonProps {
  /** The content to display inside the button. Can be text or any valid React node. */
  children?: React.ReactNode
  /** The icon to display in the button. Should be a valid icon name from Iconify in the form of `<icon-library>:<icon-name>`. */
  icon: string
  /** The position of the icon within the button. */
  iconPosition?: 'start' | 'end'
  /** The class name to apply to the icon. Can be used to customize the icon's appearance. If it doesn't work, try putting an exclamation mark at the end (applicable for valid Tailwind CSS classes). */
  iconClassName?: string
  /** Callback function to handle button click events. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Indicates whether the button is in a loading state. When true, a spinner icon is displayed and user interactions are not allowed. */
  loading?: boolean
  /** Indicates whether the button is disabled. When true, user interactions are not allowed. */
  disabled?: boolean
  /** The class name to apply to the button. Can be used to customize the button's appearance. If it doesn't work, try putting an exclamation mark at the end (applicable for valid Tailwind CSS classes). */
  className?: string
  /** The visual style variant of the button. Can be one of "primary", "secondary", "tertiary", or "plain". @default "primary" */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain'
  /** Indicates whether the button has a red background. */
  dangerous?: boolean
  /** The i18n namespace to use for the button content translation. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details on internationalization. */
  namespace?: string
  /** Additional properties to pass to the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details on internationalization. */
  tProps?: Record<string, unknown>
}

type ButtonComponentProps<C extends React.ElementType = 'button'> = {
  /** The HTML element or React component to render as the button. */
  as?: C
} & ButtonProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps>

/**
 * A button component for user interactions. Should be used consistently throughout the application. When designing pages, custom defined button should be avoided as much as possible.
 */
function Button<C extends React.ElementType = 'button'>({
  as = 'button' as C,
  children,
  icon,
  onClick,
  iconPosition = 'start',
  loading = false,
  disabled = false,
  className,
  variant = 'primary',
  dangerous = false,
  namespace = 'common.buttons',
  iconClassName,
  tProps,
  ...props
}: ButtonComponentProps<C>) {
  const { derivedThemeColor } = usePersonalization()

  const Component = as || 'button'

  const finalClassName = generateClassName(
    derivedThemeColor,
    Boolean(children),
    iconPosition === 'end',
    dangerous,
    variant,
    className || ''
  )

  const { t } = useTranslation(namespace)

  return (
    <Component
      {...(props as any)}
      className={finalClassName}
      disabled={loading || disabled}
      type="button"
      onClick={onClick}
    >
      {iconPosition === 'start' && (
        <ButtonIcon
          disabled={disabled}
          icon={icon}
          iconClassName={iconClassName}
          loading={loading}
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
            tProps
          )}
        </div>
      ) : (
        children
      )}
      {iconPosition === 'end' && (
        <ButtonIcon
          disabled={disabled}
          icon={icon}
          iconClassName={iconClassName}
          loading={loading}
        />
      )}
    </Component>
  )
}

export default Button
