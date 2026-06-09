import { type CSSProperties } from 'react'
import tinycolor from 'tinycolor2'

import { type FlexProps } from '@/components/primitives'
import { usePersonalization } from '@/providers'
import anyColorToHex from '@/utils/anyColorToHex'

export function useButtonStyleProps({
  variant,
  style,
  props
}: {
  variant: 'primary' | 'secondary' | 'tertiary' | 'plain'
  style?: CSSProperties
  props: FlexProps & Record<string, unknown>
}) {
  const { derivedThemeColor, bgTempPalette } = usePersonalization()

  const { bg: explicitBg, ...restProps } = props

  const resolvedBg =
    explicitBg && typeof explicitBg === 'string'
      ? explicitBg
      : explicitBg && typeof explicitBg === 'object' && 'base' in explicitBg
        ? (explicitBg as { base: string }).base
        : undefined

  const bgStyle = resolvedBg ? { backgroundColor: resolvedBg } : undefined

  let buttonStyle: CSSProperties = {
    ...bgStyle,
    ...style
  }

  if (variant === 'primary') {
    const bgToDetect = resolvedBg || derivedThemeColor

    const resolveColor = (color: string): string => {
      if (!color) return '#ffffff'

      if (
        color.startsWith('#') ||
        color.startsWith('rgb') ||
        color.startsWith('hsl')
      ) {
        return color
      }

      if (color.startsWith('bg-')) {
        const shade = Number(color.replace('bg-', ''))

        if (bgTempPalette && shade in bgTempPalette) {
          return bgTempPalette[shade]
        }
      }

      if (color.startsWith('custom-')) {
        if (color === 'custom-500' || color === 'primary') {
          return derivedThemeColor
        }
      }

      return color
    }

    const resolvedBgToDetect = resolveColor(bgToDetect)

    const hexBg = anyColorToHex(resolvedBgToDetect)

    const isBgLight = tinycolor(hexBg).isLight()

    const lightTextColor = bgTempPalette[100] || '#f4f4f5'

    const darkTextColor = bgTempPalette[850] || bgTempPalette[800] || '#27272a'

    const invertedTextColor = isBgLight ? darkTextColor : lightTextColor

    buttonStyle = {
      // @ts-expect-error - CSS variable
      '--button-text-color': invertedTextColor,
      ...buttonStyle
    }
  }

  return { buttonStyle, restProps }
}
