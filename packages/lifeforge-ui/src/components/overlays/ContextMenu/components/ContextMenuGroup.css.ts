import { globalStyle, style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const groupContainer = style({
  backgroundColor: withOpacity(bg[200], 0.3),
  selectors: {
    '.dark &': { backgroundColor: withOpacity(bg[700], 0.5) }
  }
})

globalStyle(`${groupContainer} > * + *`, {
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: withOpacity(bg[200], 0.8)
})

globalStyle(`.dark ${groupContainer} > * + *`, {
  borderTopColor: bg[700]
})
