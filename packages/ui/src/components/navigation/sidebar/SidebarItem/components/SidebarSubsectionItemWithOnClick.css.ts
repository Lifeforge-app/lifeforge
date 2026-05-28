import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const button = style({
  textAlign: 'left',
  transition: 'all 0.2s',
  selectors: {
    '&:hover': { backgroundColor: withOpacity(COLORS['bg-200'], 0.3) },
    '.dark &:hover': { backgroundColor: withOpacity(COLORS['bg-800'], 0.3) }
  }
})

export const buttonActive = style({
  backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
  selectors: {
    '.dark &': { backgroundColor: COLORS['bg-800'] },
    '&:hover': { backgroundColor: withOpacity(COLORS['bg-200'], 0.5) },
    '.dark &:hover': { backgroundColor: COLORS['bg-800'] }
  }
})
