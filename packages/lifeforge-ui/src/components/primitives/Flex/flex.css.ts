import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { responsiveConditions, vars } from '@/system'

import { commonProperties, themeColorProperties } from '../styles/common.css'

export const flexBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const flexProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
  properties: {
    display: ['flex', 'inline-flex'],
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
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    borderRadius: vars.radii
  }
})

export const flexSprinkles = createSprinkles(
  flexProperties,
  themeColorProperties,
  commonProperties
)

export type FlexSprinkles = Parameters<typeof flexSprinkles>[0]
