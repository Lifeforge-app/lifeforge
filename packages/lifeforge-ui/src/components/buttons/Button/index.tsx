/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import { generateClassName } from './buttonUtils'
import ButtonIcon from './components/ButtonIcon'

export interface ButtonProps {
  /** The content to display inside the button. Can be text or any valid React node. */
  children?: React.ReactNode
  /** The icon to display in the button. Should be a valid icon name from Iconify in the format `<icon-library>:<icon-name>`. */
  icon?: string
  /** The position of the icon within the button. Defaults to 'start'. */
  iconPosition?: 'start' | 'end'
  /** Additional CSS class names to apply to the icon. Use `!` suffix for Tailwind CSS class overrides. */
  iconClassName?: string
  /** Callback function called when the button is clicked. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Whether the button is in a loading state. When true, displays a spinner and disables interactions. */
  loading?: boolean
  /** Whether the button is disabled and non-interactive. */
  disabled?: boolean
  /** Additional CSS class names to apply to the button. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The visual style variant of the button. Defaults to 'primary'. */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'plain'
  /** Whether the button should be styled as dangerous/destructive with a red background. */
  dangerous?: boolean
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Additional properties for the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
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
    !!icon,
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
      {icon && iconPosition === 'start' && (
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
      {icon && iconPosition === 'end' && (
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
