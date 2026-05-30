import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  tokenizedLayoutProperties,
  tokenizedRoundedProperties,
  tokenizedSpacingProperties
} from '@/system'

export const borderedBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const borderedProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents']
  }
})

export const borderedSprinkles = createSprinkles(
  borderedProperties,
  tokenizedLayoutProperties,
  tokenizedSpacingProperties,
  tokenizedRoundedProperties
)

export type BorderedSprinkles = Parameters<typeof borderedSprinkles>[0]
