import { style } from '@vanilla-extract/css'

import { bg, custom, withOpacity } from '@/system'

export const searchWrapper = style({
  borderColor: withOpacity(bg[500], 0.2),
  transition: 'all 0.2s',
  selectors: {
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    },
    '.has-bg-image &': {
      backgroundColor: withOpacity(bg[50], 0.5),
      backdropFilter: 'blur(4px)'
    },
    '.dark .has-bg-image &': {
      backgroundColor: withOpacity(bg[900], 0.5),
      backdropFilter: 'blur(4px)'
    },
    '.has-bg-image &:hover': {
      backgroundColor: withOpacity(bg[100], 0.5)
    },
    '.dark .has-bg-image &:hover': {
      backgroundColor: withOpacity(bg[800], 0.5)
    }
  }
})

export const searchInput = style({
  backgroundColor: 'transparent',
  caretColor: custom[500],
  width: '100%'
})
