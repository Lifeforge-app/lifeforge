import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const actionButton = style({
  overscrollBehavior: 'contain',
  selectors: {
    '&:hover': {
      backgroundColor: withOpacity(bg[200], 0.5),
      color: bg[800]
    },
    '.dark &:hover': {
      backgroundColor: withOpacity(bg[700], 0.5),
      color: bg[50]
    }
  }
})
