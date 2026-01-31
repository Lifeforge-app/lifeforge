import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { defaultCondition, responsiveConditions, vars } from '../../../system'

export const textBase = recipe({
  base: {}
})

const textProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition,
  properties: {
    fontSize: vars.fontSize,
    lineHeight: vars.lineHeight,
    fontWeight: vars.fontWeight,
    color: {
      ...vars.colors,
      inherit: 'inherit',
      default: 'var(--color-bg-900)',
      muted: 'var(--color-bg-500)',
      primary: 'var(--color-custom-500)'
    },
    textAlign: ['left', 'center', 'right'],
    textDecoration: ['underline', 'line-through', 'none'],
    textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'],
    textWrap: ['wrap', 'nowrap', 'pretty', 'balance'],
    // Margin props for Text
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space
  }
})

export const textSprinkles = createSprinkles(textProperties)

export type TextSprinkles = Parameters<typeof textSprinkles>[0]
