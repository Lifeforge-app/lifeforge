import { style } from '@vanilla-extract/css'

import { custom } from '@/system'

export const dataOpen = style({
  selectors: {
    '&[data-open]': { borderColor: custom[500] }
  }
})
