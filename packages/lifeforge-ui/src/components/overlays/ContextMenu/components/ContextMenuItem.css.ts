import { style } from '@vanilla-extract/css'
import { createSprinkles } from '@vanilla-extract/sprinkles'

import { bg, themeColorProperties, vars, withOpacity } from '@/system'

const sprinkles = createSprinkles(themeColorProperties)

export const item = style({
  cursor: 'default',
  textAlign: 'left',
  outline: 'none',
  transition: 'all 0.2s',
  userSelect: 'none'
})

export const itemHoverable = style({
  selectors: {
    '&:hover': { backgroundColor: bg[200] },
    '.dark &:hover': { backgroundColor: withOpacity(bg[700], 0.5) }
  }
})

export const itemDisabled = style([
  { cursor: 'not-allowed' },
  sprinkles({ color: { base: 'bg-400', dark: 'bg-600' } })
])

export const itemActiveSafe = style([
  { fontWeight: vars.fontWeight.medium },
  sprinkles({
    color: {
      base: 'bg-800',
      dark: 'bg-50',
      hover: 'bg-800',
      darkHover: 'bg-50'
    }
  })
])

export const itemActiveDangerous = style({
  fontWeight: vars.fontWeight.medium,
  color: 'var(--color-red-600)',
  selectors: {
    '&:hover': { color: bg[800] },
    '.dark &:hover': { color: bg[50] }
  }
})

export const itemInactiveSafe = sprinkles({
  color: { base: 'bg-500', darkHover: 'bg-600' }
})

export const itemInactiveDangerous = style({
  color: 'var(--color-red-500)'
})

export const checkIconSafe = sprinkles({
  color: { base: 'bg-800', dark: 'bg-50' }
})

export const checkIconDangerous = style({ color: 'var(--color-red-600)' })
