import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const wrapper = style({
  backgroundColor: withOpacity(bg[200], 0.5),
  selectors: {
    '.dark &': { backgroundColor: withOpacity(bg[800], 0.7) }
  }
})