import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { defaultCondition, responsiveConditions, vars } from '../../../system'

export const gridBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const gridProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
    display: ['grid', 'inline-grid', 'none'],
    alignItems: ['stretch', 'center', 'start', 'end', 'baseline'],
    justifyContent: [
      'start',
      'center',
      'end',
      'space-between',
      'space-around',
      'space-evenly'
    ],
    gap: vars.space,
    rowGap: vars.space,
    columnGap: vars.space,
    gridAutoFlow: ['row', 'column', 'dense', 'row dense', 'column dense']
  }
})

export const gridSprinkles = createSprinkles(gridProperties)

export type GridSprinkles = Parameters<typeof gridSprinkles>[0]
