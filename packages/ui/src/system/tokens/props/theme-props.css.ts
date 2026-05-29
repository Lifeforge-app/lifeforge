import { defineProperties } from '@vanilla-extract/sprinkles'

import { COLORS } from '../..'

export const tokenizedThemeColorProperties = defineProperties({
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
    backgroundColor: COLORS,
    color: COLORS,
    borderColor: COLORS
  }
})
