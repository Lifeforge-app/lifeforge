import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const searchWrapper = style({
  borderColor: withOpacity(COLORS['bg-500'], 0.2),
  transition: 'all 0.2s',
  selectors: {
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    },
    '.has-bg-image &': {
      backgroundColor: withOpacity(COLORS['bg-50'], 0.5),
      backdropFilter: 'blur(4px)'
    },
    '.dark .has-bg-image &': {
      backgroundColor: withOpacity(COLORS['bg-900'], 0.5),
      backdropFilter: 'blur(4px)'
    },
    '.has-bg-image &:hover': {
      backgroundColor: withOpacity(COLORS['bg-100'], 0.5)
    },
    '.dark .has-bg-image &:hover': {
      backgroundColor: withOpacity(COLORS['bg-800'], 0.5)
    }
  }
})

export const searchInput = style({
  backgroundColor: 'transparent',
  caretColor: COLORS['custom-500'],
  width: '100%'
})
