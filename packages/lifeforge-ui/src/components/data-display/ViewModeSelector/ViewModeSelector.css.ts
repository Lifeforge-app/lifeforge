import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

// container styling (shadow, background, border, radius)
export const container = style([
  {
    borderColor: withOpacity(bg[500], 0.2),
    selectors: {
      '.dark &': { borderColor: withOpacity(bg[500], 0.5) },
      '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
    }
  }
])

// styles applied when an option is active/selected
export const optionActive = style({
  borderColor: withOpacity(bg[500], 0.2),
  selectors: {
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})
