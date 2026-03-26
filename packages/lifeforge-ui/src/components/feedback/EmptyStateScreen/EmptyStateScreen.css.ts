import { style } from '@vanilla-extract/css'

import { bg } from '@/system'

export const mutedColor = style({
  color: bg[400],
  selectors: {
    '.dark &': { color: bg[600] }
  }
})

export const preWrap = style({
  whiteSpace: 'pre-wrap'
})
