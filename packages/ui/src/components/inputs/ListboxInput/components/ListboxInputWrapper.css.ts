import { style } from '@vanilla-extract/css'

import { COLORS } from '@/system'

export const dataOpen = style({
  selectors: {
    '&[data-open]': { borderColor: COLORS['custom-500'] }
  }
})
