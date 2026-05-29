import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  tokenizedLayoutProperties,
  tokenizedRoundedProperties,
  tokenizedSpacingProperties,
  tokenizedThemeColorProperties
} from '@/system'

export const boxBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const boxProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents']
  }
})

export const boxSprinkles = createSprinkles(
  boxProperties,
  tokenizedThemeColorProperties,
  tokenizedLayoutProperties,
  tokenizedSpacingProperties,
  tokenizedRoundedProperties
)

export type BoxSprinkles = Parameters<typeof boxSprinkles>[0]
