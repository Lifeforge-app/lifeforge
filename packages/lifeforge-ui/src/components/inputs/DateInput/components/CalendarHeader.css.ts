import { style } from '@vanilla-extract/css'
import { createSprinkles } from '@vanilla-extract/sprinkles'

import { bg, themeColorProperties, vars, withOpacity } from '@/system'

export const sprinkles = createSprinkles(themeColorProperties)

export const header = sprinkles({ color: { base: 'bg-800', dark: 'bg-100' } })

export const navButton = style({
  padding: vars.space.sm,
  selectors: {
    '.dark &:hover': { backgroundColor: withOpacity(bg[700], 0.3) }
  }
})

export const select = style({
  appearance: 'none',
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.medium,
  transition: 'all 0.2s',
  selectors: {
    '&:hover': { backgroundColor: withOpacity(bg[200], 0.3) },
    '.dark &:hover': { backgroundColor: withOpacity(bg[700], 0.3) }
  }
})

export const selectArrow = style({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  width: '1.125rem',
  height: '1.125rem',
  transform: 'translateY(-50%)',
  color: bg[500]
})
