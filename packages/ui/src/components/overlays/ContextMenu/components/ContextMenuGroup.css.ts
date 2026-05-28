import { globalStyle, style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const groupContainer = style({
  backgroundColor: withOpacity(COLORS['bg-200'], 0.3),
  selectors: {
    '.dark &': { backgroundColor: withOpacity(COLORS['bg-700'], 0.5) }
  }
})

globalStyle(`${groupContainer} > * + *`, {
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: withOpacity(COLORS['bg-200'], 0.8)
})

globalStyle(`.dark ${groupContainer} > * + *`, {
  borderTopColor: COLORS['bg-700']
})
