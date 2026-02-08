import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { defaultCondition, responsiveConditions, vars } from '../../../system'
// Import to ensure responsive layout CSS is generated
import '../styles/responsive.css'

export const boxBase = recipe({
  base: {
    boxSizing: 'border-box'
  }
})

const boxProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents'],
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    padding: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    backgroundColor: vars.colors,
    borderRadius: vars.radii
  }
})

export const boxSprinkles = createSprinkles(boxProperties)

export type BoxSprinkles = Parameters<typeof boxSprinkles>[0]
