import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const actionButton = style({
  overscrollBehavior: 'contain',
  selectors: {
    '&:hover': {
      backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
      color: COLORS['bg-800']
    },
    '.dark &:hover': {
      backgroundColor: withOpacity(COLORS['bg-700'], 0.5),
      color: COLORS['bg-50']
    }
  }
})
