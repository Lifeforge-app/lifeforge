import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { commonProperties, responsiveConditions, vars } from '@/system'
import { themeColorProperties } from '@/system'
// Import to ensure responsive layout CSS is generated
import '@/system/custom-props.css'

export const boxBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const boxProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents'],
    borderRadius: vars.radii
  }
})

export const boxSprinkles = createSprinkles(
  boxProperties,
  themeColorProperties,
  commonProperties
)

export type BoxSprinkles = Parameters<typeof boxSprinkles>[0]
