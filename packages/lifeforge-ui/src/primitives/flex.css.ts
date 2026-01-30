import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { defaultCondition, responsiveConditions, vars } from '../system'

export const flexBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const flexProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
    display: ['flex', 'inline-flex'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'flex-start',
      'center',
      'space-between',
      'space-around',
      'space-evenly',
      'flex-end'
    ],
    alignItems: ['stretch', 'center', 'flex-start', 'flex-end'],
    gap: vars.space
  }
})

export const flexSprinkles = createSprinkles(flexProperties)

export type FlexSprinkles = Parameters<typeof flexSprinkles>[0]
