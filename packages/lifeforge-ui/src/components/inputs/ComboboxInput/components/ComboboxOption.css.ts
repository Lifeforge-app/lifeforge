import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const option = style({
  cursor: 'pointer',
  transition: 'all 0.2s',
  selectors: {
    '&:not(:first-child)': {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: bg[200]
    },
    '.dark &:not(:first-child)': {
      borderTopColor: withOpacity(bg[700], 0.5)
    },
    '.dark &:hover': { backgroundColor: withOpacity(bg[700], 0.5) }
  }
})
