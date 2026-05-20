import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { commonProperties, responsiveConditions, vars } from '@/system'
import { themeColorProperties } from '@/system'

export const gridBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const gridProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
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
    gridAutoFlow: ['row', 'column', 'dense', 'row dense', 'column dense'],
    borderRadius: vars.radii
  }
})

export const gridSprinkles = createSprinkles(
  gridProperties,
  themeColorProperties,
  commonProperties
)

export type GridSprinkles = Parameters<typeof gridSprinkles>[0]
