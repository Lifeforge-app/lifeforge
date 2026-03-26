import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { defaultCondition, responsiveConditions, vars } from '../../../system'

/**
 * Shared CSS properties used by all layout primitives (Box, Flex, Grid, Section).
 * Compose this into each primitive's sprinkles via createSprinkles(..., commonProperties).
 */
export const commonProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
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
    marginRight: vars.space
  }
})

export const commonSprinkles = createSprinkles(commonProperties)

export type CommonSprinkles = Parameters<typeof commonSprinkles>[0]
