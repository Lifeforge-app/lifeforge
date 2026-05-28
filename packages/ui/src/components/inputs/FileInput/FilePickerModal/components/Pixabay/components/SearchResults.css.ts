import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const photoButton = style({
  position: 'relative',
  display: 'block',
  overflow: 'hidden',
  borderRadius: 'var(--radius-md)',
  backgroundColor: COLORS['bg-200'],
  outline: `2px solid transparent`,
  outlineOffset: '2px',
  transition: 'all 0.2s',
  selectors: {
    '.dark &': { backgroundColor: withOpacity(COLORS['bg-800'], 0.5) },
    '&:hover': { outline: `2px solid ${COLORS['bg-400']}` },
    '.dark &:hover': { outline: `2px solid ${COLORS['bg-600']}` }
  }
})

export const photoButtonSelected = style({
  outline: `2px solid ${COLORS['custom-500']}`,
  selectors: {
    '.dark &': { outline: `2px solid ${COLORS['custom-500']}` }
  }
})

export const photoWrapper = style({
  padding: '0 0.5rem'
})
