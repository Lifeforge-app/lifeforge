import { type CSSProperties } from 'react'
import { usePersonalization } from 'shared'

import { type FlexProps } from '@components/primitives'

export function useButtonStyleProps({
  variant,
  style,
  props
}: {
  variant: 'primary' | 'secondary' | 'tertiary' | 'plain'
  style?: CSSProperties
  props: FlexProps & Record<string, unknown>
}) {
  const { derivedThemeColor, getMostReadableColor } = usePersonalization()

  const { bg: explicitBg, ...restProps } = props

  const bgStyle =
    explicitBg && typeof explicitBg === 'string'
      ? { backgroundColor: explicitBg }
      : explicitBg && typeof explicitBg === 'object' && 'base' in explicitBg
        ? { backgroundColor: (explicitBg as { base: string }).base }
        : undefined

  const buttonStyle: CSSProperties = {
    ...(variant === 'primary' && {
      '--button-text-color': getMostReadableColor(derivedThemeColor)
    }),
    ...bgStyle,
    ...style
  }

  return { buttonStyle, restProps }
}
