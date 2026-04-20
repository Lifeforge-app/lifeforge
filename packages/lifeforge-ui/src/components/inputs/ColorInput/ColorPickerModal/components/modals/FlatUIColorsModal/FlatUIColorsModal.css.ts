import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

export const card = style({
  selectors: {
    '.dark &': {
      backgroundColor: withOpacity(bg[800], 0.7) + ' !important'
    }
  }
})

export const colorButton = style({
  boxShadow: 'var(--custom-shadow)',
  aspectRatio: '1',
  cursor: 'pointer'
})

export const colorButtonSelected = style({
  boxShadow: `0 0 0 2px ${bg[100]}, 0 0 0 4px ${bg[900]}, var(--custom-shadow)`,
  selectors: {
    '.dark &': {
      boxShadow: `0 0 0 2px ${bg[900]}, 0 0 0 4px ${bg[50]}, var(--custom-shadow)`
    }
  }
})
