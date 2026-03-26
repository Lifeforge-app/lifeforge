import { style } from '@vanilla-extract/css'

import { bg, vars, withOpacity } from '@/system'

export const base = style({
  backdropFilter: 'var(--backdrop-filter-surface)',
  backgroundColor: bg.surface,
  borderRadius: vars.radii.lg,
  boxShadow: 'var(--custom-shadow)',
  display: 'block',
  padding: vars.space.md,
  position: 'relative',
  selectors: {
    '.bordered &': {
      borderColor: withOpacity(bg[500], 0.2),
      borderStyle: 'solid',
      borderWidth: '2px'
    }
  }
})

export const interactive = style({
  cursor: 'pointer',
  transition: 'all 0.2s',
  selectors: {
    '&:hover': { backgroundColor: bg['surface-hover'] }
  }
})
