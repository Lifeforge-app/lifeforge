import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { RESPONSIVE_CONDITIONS, tokenizedSpacingProperties, vars } from '@/system'

export const textBase = recipe({
  base: {}
})

const textProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    fontSize: vars.fontSize,
    lineHeight: {
      ...vars.lineHeight,
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    fontWeight: vars.fontWeight,
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    textAlign: ['left', 'center', 'right'],
    textDecoration: ['underline', 'line-through', 'none'],
    textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'],
    textWrap: ['wrap', 'nowrap', 'pretty', 'balance'],
    whiteSpace: [
      'normal',
      'nowrap',
      'pre',
      'pre-line',
      'pre-wrap',
      'break-spaces'
    ],
    wordBreak: ['normal', 'break-all', 'keep-all'],
    overflowWrap: ['normal', 'break-word', 'anywhere'],
    display: [
      'block',
      'inline',
      'inline-block',
      'flex',
      'inline-flex',
      'none',
      'contents'
    ],
    trim: ['normal', 'start', 'end', 'both']
  }
})

export const textSprinkles = createSprinkles(
  textProperties,
  tokenizedSpacingProperties
)

export type TextSprinkles = Parameters<typeof textSprinkles>[0]
