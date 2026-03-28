/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import _ from 'lodash'
import React, { type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import { Box, Flex, Slot, Text } from '@components/primitives'

import { buttonRecipe } from './button.css'
import ButtonIcon from './components/ButtonIcon'

export interface ButtonProps {
  ref?: React.RefObject<HTMLButtonElement | null>
  /** Whether to merge button styles into a single child element instead of rendering a native button. */
  asChild?: boolean
  /** The content to display inside the button. Can be text or any valid React node. */
  children?: React.ReactNode
  /** The icon to display in the button. Should be a valid icon name from Iconify in the format `<icon-library>:<icon-name>`. */
  icon?: string
  /** The position of the icon within the button. Defaults to 'start'. */
  iconPosition?: 'start' | 'end'
  /** Additional CSS class names to apply to the icon. Use `!` suffix for Tailwind CSS class overrides. */
  iconClassName?: string
  /** Callback function called when the button is clicked. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
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
  style?: CSSProperties
}

/**
 * A button component for user interactions. Should be used consistently throughout the application. When designing pages, custom defined button should be avoided as much as possible.
 */
function Button({
  ref,
  asChild = false,
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
  style,
  ...props
}: ButtonProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonProps>) {
  const { derivedThemeColor } = usePersonalization()

  const hasIconWithChildren = icon && children ? iconPosition : false

  const recipeClassName = buttonRecipe({
    variant,
    dangerous,
    hasIconWithChildren
  })

  const buttonStyle: CSSProperties = {
    ...style,
    ...(variant === 'primary' && {
      '--button-text-color': tinycolor(derivedThemeColor).isLight()
        ? 'var(--color-bg-800)'
        : 'var(--color-bg-50)'
    })
  } as CSSProperties

  const { t } = useTranslation(namespace)

  const renderContent = (text: React.ReactNode) => (
    <>
      {icon && iconPosition === 'start' && (
        <ButtonIcon
          disabled={disabled}
          hasChildren={Boolean(text)}
          icon={icon}
          iconClassName={iconClassName}
          loading={loading}
        />
      )}
      {text && typeof text === 'string' ? (
        <Box asChild minWidth="0">
          <Text truncate>
            {t(
              [
                `${_.camelCase(text)}`,
                `buttons.${_.camelCase(text)}`,
                `common.buttons:${_.camelCase(text)}`,
                text
              ],
              tProps
            )}
          </Text>
        </Box>
      ) : (
        text
      )}
      {icon && iconPosition === 'end' && (
        <ButtonIcon
          disabled={disabled}
          icon={icon}
          iconClassName={iconClassName}
          loading={loading}
        />
      )}
    </>
  )

  if (asChild) {
    return (
      <Slot
        ref={ref as any}
        className={clsx(recipeClassName, className)}
        style={buttonStyle}
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <Flex
      as="button"
      {...(props as any)}
      ref={ref}
      className={clsx(recipeClassName, className)}
      disabled={loading || disabled}
      style={buttonStyle}
      type="button"
      onClick={onClick}
    >
      {renderContent(children)}
    </Flex>
  )
}

export default Button
