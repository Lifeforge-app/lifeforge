import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  commonProperties,
  responsiveConditions,
  themeColorProperties,
  vars
} from '@/system'
// Import to ensure responsive layout CSS is generated
import '@/system/custom-props.css'

/**
 * Base recipe — sets box-sizing only.
 * All border geometry lives in inline styles; colours in the sprinkle.
 */
export const borderedBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const borderedProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents'],
    borderRadius: vars.radii
  }
})

/**
 * Sprinkles for Bordered.
 *
 * Composes:
 * - `display` and `borderRadius` with responsive breakpoint support
 * - `backgroundColor`, `color`, `borderColor` with theme-condition support
 *   (base / dark / hover / darkHover / hasBgImage / darkHasBgImage)
 * - `padding`, `margin`, `position`, `overflow` via commonProperties
 */
export const borderedSprinkles = createSprinkles(
  borderedProperties,
  themeColorProperties,
  commonProperties
)

export type BorderedSprinkles = Parameters<typeof borderedSprinkles>[0]
