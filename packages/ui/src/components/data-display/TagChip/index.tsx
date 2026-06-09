import { type ComponentPropsWithoutRef, type ElementType } from 'react'
import tinycolor from 'tinycolor2'

import { anyColorToHex } from '@lifeforge/shared'

import {
  Bordered,
  type BorderedOwnProps,
  Box,
  Flex,
  Icon,
  Text,
  Transition
} from '@/components/primitives'
import { usePersonalization } from '@/providers'

type TagChipProps<T extends ElementType> = Omit<
  BorderedOwnProps,
  'color' | 'as'
> & {
  as?: T
  /** The text label displayed on the tag chip. */
  label: string | React.ReactNode
  /** The icon to display alongside the label. Can be an Iconify icon name or custom HTML string prefixed with 'customHTML:'. */
  icon?: string
  /** The color of the tag chip. If provided, it customizes the text, border and background colors. */
  color?: string
  /** The size variant of the tag chip. */
  size?: 'sm' | 'base'
  /** Optional action button properties, including icon and click handler.
   * If provided, an action button will be displayed at the end of the tag chip. */
  variant?: 'outlined' | 'filled'
  actionButtonProps?: {
    icon: string
    onClick?: () => void
  }
  /** Optional click handler for the entire tag chip. */
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
} & Omit<
    ComponentPropsWithoutRef<T>,
    | keyof Omit<BorderedOwnProps, 'color' | 'as'>
    | 'as'
    | 'label'
    | 'icon'
    | 'color'
    | 'size'
    | 'variant'
    | 'actionButtonProps'
    | 'onClick'
  >

export function TagChip<T extends ElementType = 'button'>({
  label,
  icon,
  color,
  variant = 'outlined',
  size = 'base',
  actionButtonProps,
  onClick,
  ...rest
}: TagChipProps<T>) {
  const { getMostReadableColor } = usePersonalization()

  const convertedColor = color ? anyColorToHex(color) : color

  const computedStyle: React.CSSProperties =
    convertedColor !== undefined
      ? variant === 'outlined'
        ? {
            borderColor: tinycolor(convertedColor).setAlpha(0.25).toString(),
            backgroundColor: tinycolor(convertedColor)
              .setAlpha(0.125)
              .toString(),
            color
          }
        : {
            borderColor: convertedColor,
            backgroundColor: convertedColor,
            color: getMostReadableColor(convertedColor)
          }
      : {}

  return (
    <Transition>
      <Text
        asChild
        color={
          color === undefined
            ? { base: 'bg-500', dark: 'bg-400' }
            : { dark: 'bg-500' }
        }
      >
        <Bordered
          as={(rest.as ?? 'button') as ElementType}
          bg={
            color === undefined && variant === 'filled'
              ? { base: 'bg-200', dark: 'bg-800' }
              : undefined
          }
          borderColor={
            color === undefined && variant === 'filled'
              ? { base: 'bg-200', dark: 'bg-800' }
              : {
                  dark: 'bg-800',
                  base: 'bg-300'
                }
          }
          borderWidth="1px"
          display="inline-block"
          minWidth="0"
          px="sm"
          py="xs"
          r="full"
          onClick={onClick}
          {...(rest as Record<string, unknown>)}
          style={{
            ...rest.style,
            ...computedStyle
          }}
        >
          <Flex align="center" flexShrink="0" gap="xs" minWidth="0">
            {(() => {
              if (!icon) return null

              if (icon.startsWith('customHTML:')) {
                if (icon.replace(/^customHTML:/, '') === '') return null

                return (
                  <Flex as="span" height="md" width="md">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: icon.replace(/^customHTML:/, '')
                      }}
                    />
                  </Flex>
                )
              } else {
                return (
                  <Icon icon={icon} size={size === 'base' ? '1em' : '0.75em'} />
                )
              }
            })()}
            {typeof label === 'string' ? (
              <Box asChild minWidth="0">
                <Text
                  truncate
                  size={size === 'base' ? 'sm' : 'xs'}
                  weight="medium"
                >
                  {label}
                </Text>
              </Box>
            ) : (
              label
            )}
            {actionButtonProps && (
              <>
                <Box as="span" width="xs" />
                <button onClick={actionButtonProps.onClick}>
                  <Icon icon={actionButtonProps.icon} size="1em" />
                </button>
              </>
            )}
          </Flex>
        </Bordered>
      </Text>
    </Transition>
  )
}
