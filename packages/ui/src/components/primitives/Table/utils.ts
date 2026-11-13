import { clsx } from 'clsx'
import type { CSSProperties } from 'react'

import {
  type ColorValue,
  type ThemeConditionProp,
  resolveColorProp
} from '@/system'

export function resolveTableColorStyles(
  bg: ThemeConditionProp<ColorValue> | undefined,
  color: ThemeConditionProp<ColorValue> | undefined
): { className: string; style: CSSProperties } {
  const bgStyle = resolveColorProp('bg', bg)

  const colorStyle = resolveColorProp('color', color)

  return {
    className: clsx(bgStyle.className, colorStyle.className),
    style: { ...bgStyle.style, ...colorStyle.style }
  }
}
