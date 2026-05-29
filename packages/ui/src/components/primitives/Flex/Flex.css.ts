import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  tokenizedLayoutProperties,
  tokenizedRoundedProperties,
  tokenizedSpacingProperties,
  tokenizedThemeColorProperties,
  vars
} from '@/system'

export const flexBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const flexProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    display: ['flex', 'inline-flex', 'none'],
    flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'],
    justifyContent: [
      'flex-start',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
      'flex-end'
    ],
    alignItems: ['stretch', 'center', 'flex-start', 'flex-end', 'baseline'],
    gap: vars.space,
    rowGap: vars.space,
    columnGap: vars.space,
    flexGrow: [0, 1],
    flexShrink: [0, 1],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse']
  }
})

export const flexSprinkles = createSprinkles(
  flexProperties,
  tokenizedLayoutProperties,
  tokenizedSpacingProperties,
  tokenizedThemeColorProperties,
  tokenizedRoundedProperties
)

export type FlexSprinkles = Parameters<typeof flexSprinkles>[0]
