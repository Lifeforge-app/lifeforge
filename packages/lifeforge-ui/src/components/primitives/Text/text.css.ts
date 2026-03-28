import { recipe } from '@vanilla-extract/recipes'
import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'

import { colors, responsiveConditions, vars } from '@/system'

export const textBase = recipe({
  base: {}
})

const textColorValues = {
  ...colors,
  inherit: 'inherit',
  default: 'var(--color-bg-900)',
  muted: 'var(--color-bg-500)',
  primary: 'var(--color-custom-500)'
} as const

/** Theme-aware color/backgroundColor for Text — supports dark/hover/hasBgImage conditions. */
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
    backgroundColor: colors
  }
})

const textProperties = defineProperties({
  conditions: responsiveConditions,
  defaultCondition: 'base',
  properties: {
    fontSize: vars.fontSize,
    lineHeight: vars.lineHeight,
    fontWeight: vars.fontWeight,
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
    // Margin props for Text
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    // Padding props for Text
    padding: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space
  }
})

export const textSprinkles = createSprinkles(
  textColorProperties,
  textProperties
)

export type TextSprinkles = Parameters<typeof textSprinkles>[0]

export type TextColorValues = keyof typeof textColorValues
