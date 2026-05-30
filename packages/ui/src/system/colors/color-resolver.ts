import { type ResolvedStyle, mergeStyle } from '../props-resolver'
import { isColorWithOpacity } from './color-with-opacity'
import {
  COLORS,
  COLOR_PROP_DEFS,
  type ColorPropName,
  type ColorValue,
  THEME_CONDITIONS,
  type ThemeConditionProp,
  type ThemeConditionPropName
} from './constants'

const resolveColor = (value: ColorValue) =>
  isColorWithOpacity(value) ? value.toString() : COLORS[value]

/**
 * Resolves a color prop value into CSS class names and custom property styles.
 *
 * Supports static color values (string or `ColorWithOpacity`) and
 * theme-condition-aware objects (e.g. `{ base: 'red', dark: 'blue' }`).
 *
 * @param propName - The color property name (e.g. `'bg'`, `'color'`).
 * @param value - A color value, a `ColorWithOpacity`, or a map of
 *                theme conditions to color values. `undefined` returns empty styles.
 * @returns A `ResolvedStyle` with concatenated class names and CSS custom property styles.
 */
export function resolveColorProp(
  propName: ColorPropName,
  value: ThemeConditionProp<ColorValue> | undefined
): ResolvedStyle {
  let final = { className: '', style: {} as const }

  if (value === undefined) return final

  const classBase = COLOR_PROP_DEFS[propName].className

  const varBase = COLOR_PROP_DEFS[propName].varPrefix

  if (typeof value === 'string' || isColorWithOpacity(value)) {
    return {
      className: classBase,
      style: { [varBase]: resolveColor(value) }
    }
  }

  for (const [condition, colorValue] of Object.entries(value) as [
    ThemeConditionPropName,
    ColorValue
  ][]) {
    if (colorValue === undefined) continue

    const condDef = THEME_CONDITIONS[condition]

    if (!condDef) continue

    final = mergeStyle(final, {
      className: `${classBase}${condDef.suffix}`,
      style: { [`${varBase}${condDef.suffix}`]: resolveColor(colorValue) }
    })
  }

  return final
}
