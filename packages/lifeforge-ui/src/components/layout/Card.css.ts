import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const base = style({
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
  transition: 'all 0.2s'
})
