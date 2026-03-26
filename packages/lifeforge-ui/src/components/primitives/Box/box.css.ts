import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  colors,
  defaultCondition,
  responsiveConditions,
  vars
} from '../../../system'
import { commonProperties } from '../styles/common.css'
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
    backgroundColor: colors,
    borderRadius: vars.radii
  }
})

export const boxSprinkles = createSprinkles(boxProperties, commonProperties)

export type BoxSprinkles = Parameters<typeof boxSprinkles>[0]
