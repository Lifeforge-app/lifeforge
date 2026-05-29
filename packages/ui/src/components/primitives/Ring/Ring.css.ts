import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  COLORS,
  RESPONSIVE_CONDITIONS,
  tokenizedLayoutProperties,
  tokenizedRoundedProperties,
  tokenizedSpacingProperties
} from '@/system'

const mapColorsToVars = (variableName: string) => {
  const result: Record<string, Record<string, string>> = {}

  for (const [key, value] of Object.entries(COLORS)) {
    result[key] = { [variableName]: value }
  }

  return result
}

export const ringColorProperties = defineProperties({
  conditions: {
    base: {},
    dark: { selector: '.dark &' },
    hover: { selector: '&:hover' },
    darkHover: { selector: '.dark &:hover' }
  },
  defaultCondition: 'base',
  properties: {
    ringColor: mapColorsToVars('--lf-ring-color'),
    ringOffsetColor: mapColorsToVars('--lf-ring-offset-color')
  }
})

const ringProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    display: ['block', 'inline', 'inline-block', 'none', 'contents']
  }
})

export const ringBase = recipe({
  base: {
    boxSizing: 'border-box',
    boxShadow: [
      'var(--lf-ring-offset-shadow, var(--lf-ring-inset, ) 0 0 0 var(--lf-ring-offset-width, 0px) var(--lf-ring-offset-color, transparent))',
      'var(--lf-ring-shadow, var(--lf-ring-inset, ) 0 0 0 calc(var(--lf-ring-offset-width, 0px) + var(--lf-ring-width, 3px)) var(--lf-ring-color, var(--color-custom-500)))',
      'var(--lf-shadow, 0 0 #0000)'
    ].join(', ')
  }
})

export const ringSprinkles = createSprinkles(
  ringProperties,
  ringColorProperties,
  tokenizedLayoutProperties,
  tokenizedSpacingProperties,
  tokenizedRoundedProperties
)

export type RingSprinkles = Parameters<typeof ringSprinkles>[0]
