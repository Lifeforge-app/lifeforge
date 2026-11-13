import { type CSSProperties } from 'react'
import tinycolor from 'tinycolor2'

import { type FlexProps } from '@/components/primitives'
import { usePersonalization } from '@/providers'
import { COLORS, isColorWithOpacity } from '@/system'
import anyColorToHex from '@/utils/anyColorToHex'

function toHex(color: string): string {
  try {
    return anyColorToHex(color) ?? color
  } catch {
    return color
  }
}

function resolveBgColor(
  value: unknown,
  derivedThemeColor: string,
  bgTempPalette: Record<number, string>
): string | undefined {
  if (typeof value === 'string') {
    if (value === 'primary' || value === 'custom-500') {
      return derivedThemeColor
    }

    if (value.startsWith('bg-')) {
      const shade = Number(value.replace('bg-', ''))

      if (shade in bgTempPalette) {
        return bgTempPalette[shade]
      }
    }

    return COLORS[value as keyof typeof COLORS] ?? value
  }

  if (isColorWithOpacity(value)) {
    return value.toString()
  }

  if (value && typeof value === 'object' && 'base' in value) {
    return resolveBgColor(value.base, derivedThemeColor, bgTempPalette)
  }

  return undefined
}

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

  const resolvedBg = resolveBgColor(
    explicitBg,
    derivedThemeColor,
    bgTempPalette
  )

  const bgStyle = resolvedBg ? { backgroundColor: resolvedBg } : undefined

  let buttonStyle: CSSProperties = {
    ...bgStyle,
    ...style
  }

  if (variant === 'primary') {
    const bgToDetect = resolvedBg || derivedThemeColor

    const hexBg = toHex(bgToDetect)

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
