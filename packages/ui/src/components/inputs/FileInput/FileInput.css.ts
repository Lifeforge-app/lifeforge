import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const wrapper = style({
  backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
  selectors: {
    '.dark &': { backgroundColor: withOpacity(COLORS['bg-800'], 0.7) }
  }
})
