import { style } from '@vanilla-extract/css'

import { bg, vars, withOpacity } from '@/system'

export const subsectionExpanded = style({
  maxHeight: '1000px',
  paddingTop: vars.space.sm,
  paddingBottom: vars.space.sm
})

export const subsectionCollapsed = style({
  maxHeight: '0',
  paddingTop: '0',
  paddingBottom: '0'
})

export const subsectionListBg = style({
  backgroundColor: bg[100],
  selectors: {
    '.dark &': { backgroundColor: withOpacity(bg[800], 0.3) }
  }
})
