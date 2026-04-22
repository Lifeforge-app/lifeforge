import { style } from '@vanilla-extract/css'

import { bg, custom, withOpacity } from '@/system'

export const photoButton = style({
  position: 'relative',
  display: 'block',
  overflow: 'hidden',
  borderRadius: 'var(--radius-md)',
  backgroundColor: bg[200],
  outline: `2px solid transparent`,
  outlineOffset: '2px',
  transition: 'all 0.2s',
  selectors: {
    '.dark &': { backgroundColor: withOpacity(bg[800], 0.5) },
    '&:hover': { outline: `2px solid ${bg[400]}` },
    '.dark &:hover': { outline: `2px solid ${bg[600]}` }
  }
})

export const photoButtonSelected = style({
  outline: `2px solid ${custom[500]}`,
  selectors: {
    '.dark &': { outline: `2px solid ${custom[500]}` }
  }
})

export const photoWrapper = style({
  padding: '0 0.5rem'
})
