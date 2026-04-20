import { style } from '@vanilla-extract/css'

import { bg } from '@/system'

export const colorDot = style({
  selectors: {
    '.group:focus-within &': { borderColor: bg[400] },
    '.dark .group:focus-within &': { borderColor: bg[700] }
  }
})
