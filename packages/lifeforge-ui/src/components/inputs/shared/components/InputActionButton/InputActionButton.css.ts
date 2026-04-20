import { style } from '@vanilla-extract/css'

import { bg } from '@/system'

export const root = style({
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: bg[500],
  transition: 'all 0.2s',
  selectors: {
    '&:hover:not(:disabled)': { color: bg[800], backgroundColor: bg[300] },
    '.dark &:hover:not(:disabled)': {
      color: bg[200],
      backgroundColor: bg[700]
    },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.5 }
  }
})
