/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import _ from 'lodash'
import React, { type CSSProperties, type ElementType } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Flex,
  type FlexProps,
  Text,
  Transition
} from '@/components/primitives'

import { buttonRecipe } from './Button.css'
import { ButtonIcon } from './components/ButtonIcon'
import { useButtonStyleProps } from './hooks/useButtonStyleProps'

type ButtonOwnProps = {
  /** The content to display inside the button. Can be text or any valid React node. */
  children?: React.ReactNode
  /** The icon to display in the button. Should be a valid icon name from Iconify in the format `<icon-library>:<icon-name>`. */
  icon?: string
  /** The position of the icon within the button. Defaults to 'start'. */
  iconPosition?: 'start' | 'end'
  /** Additional CSS styles to apply to the icon. */
  iconStyle?: React.CSSProperties
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

type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonOwnProps> &
  FlexProps<T> & {
    /** Ref for the button element. */
    ref?: React.Ref<Element>
  }

/**
 * A button component for user interactions. Should be used consistently throughout the application. When designing pages, custom defined button should be avoided as much as possible.
 */
export function Button<T extends ElementType = 'button'>({
  ref,
  as,
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
  iconStyle,
  tProps,
  style,
  ...props
}: ButtonProps<T>) {
  const recipeClassName = buttonRecipe({
    variant,
    dangerous
  })

  const { buttonStyle, restProps } = useButtonStyleProps({
    variant,
    style,
    props: props as any
  })

  const { t } = useTranslation(namespace)

  return (
    <Transition>
      <Text
        asChild
        tabIndex={-1}
        tracking="wide"
        weight="medium"
        whiteSpace="nowrap"
      >
        <Flex
          ref={ref}
          align="center"
          as={as ?? ('button' as ElementType)}
          className={clsx(recipeClassName, className)}
          disabled={loading || disabled}
          flexShrink="0"
          gap="sm"
          justify="center"
          minWidth="0"
          p="md"
          r="lg"
          style={buttonStyle}
          type="button"
          onClick={onClick}
          {...(restProps as any)}
        >
          {icon && iconPosition === 'start' && (
            <ButtonIcon
              disabled={disabled}
              hasChildren={Boolean(children)}
              icon={icon}
              iconStyle={iconStyle}
              loading={loading}
            />
          )}
          {children && typeof children === 'string' ? (
            <Box asChild minWidth="0">
              <Text truncate>
                {t(
                  [
                    `${_.camelCase(children)}`,
                    `buttons.${_.camelCase(children)}`,
                    `common.buttons:${_.camelCase(children)}`,
                    children
                  ],
                  tProps
                )}
              </Text>
            </Box>
          ) : (
            children
          )}
          {icon && iconPosition === 'end' && (
            <ButtonIcon
              disabled={disabled}
              hasChildren={Boolean(children)}
              icon={icon}
              iconStyle={iconStyle}
              loading={loading}
            />
          )}
        </Flex>
      </Text>
    </Transition>
  )
}
