import { Icon } from '@iconify/react'
import { formatHex, parse } from 'culori'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  Bordered,
  type BorderedProps,
  Box,
  Flex,
  Text,
  Transition
} from '@components/primitives'

interface TagChipProps extends Omit<BorderedProps, 'color'> {
  /** The text label displayed on the tag chip. */
  label: string | React.ReactNode
  /** The icon to display alongside the label. Can be an Iconify icon name or custom HTML string prefixed with 'customHTML:'. */
  icon?: string
  /** The color of the tag chip. If provided, it customizes the text, border and background colors. */
  color?: string
  /** Optional action button properties, including icon and click handler.
   * If provided, an action button will be displayed at the end of the tag chip. */
  variant?: 'outlined' | 'filled'
  actionButtonProps?: {
    icon: string
    onClick?: () => void
  }
  /** Optional click handler for the entire tag chip. */
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

// fallback classes have been replaced by vanilla-extract styles

/**
 * A tag chip component that displays a label with an optional icon and customizable color.
 */
function TagChip({
  label,
  icon,
  color,
  variant = 'outlined',
  actionButtonProps,
  onClick,
  ...rest
}: TagChipProps) {
  const { getMostReadableColor } = usePersonalization()

  const convertedColor = color?.startsWith('oklch(')
    ? formatHex(parse(color))
    : color

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
          as="button"
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
          minWidth="0"
          px="sm"
          py="xs"
          rounded="full"
          style={computedStyle}
          onClick={onClick}
          {...rest}
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
                return <Icon height="1em" icon={icon} width="1em" />
              }
            })()}
            {typeof label === 'string' ? (
              <Box asChild minWidth="0">
                <Text truncate size="sm" weight="medium">
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
                  <Icon
                    height="1em"
                    icon={actionButtonProps.icon}
                    width="1em"
                  />
                </button>
              </>
            )}
          </Flex>
        </Bordered>
      </Text>
    </Transition>
  )
}

export default TagChip
