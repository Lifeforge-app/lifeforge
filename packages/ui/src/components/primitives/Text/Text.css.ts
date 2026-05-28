import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import {
  COLORS,
  RESPONSIVE_CONDITIONS,
  tokenizedSpacingProperties,
  vars
} from '@/system'

export const textBase = recipe({
  base: {}
})

const textColorValues = {
  ...COLORS,
  inherit: 'inherit',
  default: 'var(--color-bg-900)',
  muted: 'var(--color-bg-500)',
  primary: 'var(--color-custom-500)',
  dangerous: COLORS.dangerous
} as const

/** Theme-aware color/backgroundColor for Text - supports dark/hover/hasBgImage conditions. */
const textColorProperties = defineProperties({
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
    color: textColorValues,
    backgroundColor: COLORS
  }
})

const textProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    fontSize: vars.fontSize,
    lineHeight: {
      ...vars.lineHeight,
      // Named leading scale (overrides size-based lineHeight when 'leading' prop is used)
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
  textColorProperties,
  textProperties,
  tokenizedSpacingProperties
)

export type TextSprinkles = Parameters<typeof textSprinkles>[0]

export type TextColorValues = keyof typeof textColorValues
