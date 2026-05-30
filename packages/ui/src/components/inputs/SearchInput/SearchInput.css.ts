import { style } from '@vanilla-extract/css'

import { COLORS } from '@/system'

export const searchInput = style({
  backgroundColor: 'transparent',
  caretColor: COLORS['custom-500'],
  width: '100%'
})
