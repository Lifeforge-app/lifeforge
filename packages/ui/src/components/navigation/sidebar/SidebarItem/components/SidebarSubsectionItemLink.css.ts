import { style } from '@vanilla-extract/css'

import { COLORS, vars, withOpacity } from '@/system'

export const link = style({
  transition: 'all 0.2s',
  selectors: {
    '&:hover': { backgroundColor: withOpacity(COLORS['bg-200'], 0.3) },
    '.dark &:hover': { backgroundColor: withOpacity(COLORS['bg-800'], 0.3) }
  }
})

export const linkCollapsed = style({
  justifyContent: 'center',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.sm
})

export const linkExpanded = style({
  paddingLeft: '3rem'
})

export const linkActive = style({
  backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
  boxShadow: 'var(--custom-shadow)',
  selectors: {
    '.dark &': { backgroundColor: COLORS['bg-800'] },
    '&:hover': { backgroundColor: withOpacity(COLORS['bg-200'], 0.5) },
    '.dark &:hover': { backgroundColor: COLORS['bg-800'] }
  }
})
