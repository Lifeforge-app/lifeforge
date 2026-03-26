import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { colors } from './colors'
import { responsiveConditions } from './responsive'
import { vars } from './vars.css'

/**
 * Shared CSS properties used by all layout primitives (Box, Flex, Grid, Section).
 * Compose this into each primitive's sprinkles via createSprinkles(..., commonProperties).
 */
export const commonProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
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

/**
 * Theme-aware color properties shared by all container primitives.
 * Supports dark / hover / has-bg-image conditions so components can express
 * full adaptive colours directly in JSX props instead of selector blocks.
 *
 * @example
 * <Box bg={{ base: 'bg-50', dark: 'bg-900', hover: 'bg-100' }} />
 */
export const themeColorProperties = defineProperties({
  conditions: {
    base: {},
    dark: { selector: '.dark &' },
    hover: { selector: '&:hover' },
    darkHover: { selector: '.dark &:hover' },
    hasBgImage: { selector: '.has-bg-image &' },
    darkHasBgImage: { selector: '.dark .has-bg-image &' }
  },
  defaultCondition: 'base',
  properties: {
    backgroundColor: colors,
    color: colors,
    borderColor: colors
  }
})

export const commonSprinkles = createSprinkles(commonProperties)

export type CommonSprinkles = Parameters<typeof commonSprinkles>[0]
