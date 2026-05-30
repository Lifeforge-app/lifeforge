import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  tokenizedLayoutProperties,
  tokenizedRoundedProperties,
  tokenizedSpacingProperties
} from '@/system'

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
    // @ts-expect-error - Custom classname
    '--lf-ring-color-resolved': 'var(--lf-ring-color, var(--color-custom-500))',
    outline: 'solid',
    outlineWidth: 'var(--lf-ring-width, 3px)',
    outlineColor: 'var(--lf-ring-color-resolved)',
    outlineOffset: 'var(--lf-ring-offset-width, 0px)',
    selectors: {
      '.dark &': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-dark, var(--lf-ring-color, var(--color-custom-500)))'
      },
      '&:hover': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-hover, var(--lf-ring-color, var(--color-custom-500)))'
      },
      '.dark &:hover': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-dark-hover, var(--lf-ring-color-dark, var(--lf-ring-color-hover, var(--lf-ring-color, var(--color-custom-500)))))'
      },
      '.has-bg-image &': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-has-bg-image, var(--lf-ring-color, var(--color-custom-500)))'
      },
      '.dark .has-bg-image &': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-dark-has-bg-image, var(--lf-ring-color-dark, var(--lf-ring-color-has-bg-image, var(--lf-ring-color, var(--color-custom-500)))))'
      },
      '.has-bg-image &:hover': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-has-bg-image-hover, var(--lf-ring-color-hover, var(--lf-ring-color-has-bg-image, var(--lf-ring-color, var(--color-custom-500)))))'
      },
      '.dark .has-bg-image &:hover': {
        '--lf-ring-color-resolved':
          'var(--lf-ring-color-has-bg-image-dark-hover, var(--lf-ring-color-dark-hover, var(--lf-ring-color-has-bg-image-hover, var(--lf-ring-color-dark-has-bg-image, var(--lf-ring-color-dark, var(--lf-ring-color, var(--color-custom-500)))))))'
      }
    }
  }
})

export const ringSprinkles = createSprinkles(
  ringProperties,
  tokenizedLayoutProperties,
  tokenizedSpacingProperties,
  tokenizedRoundedProperties
)

export type RingSprinkles = Parameters<typeof ringSprinkles>[0]
