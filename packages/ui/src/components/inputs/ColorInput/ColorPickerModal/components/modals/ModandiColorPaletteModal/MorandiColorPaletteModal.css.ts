import { style } from '@vanilla-extract/css'

import { COLORS, shadowClass } from '@/system'

export const colorButton = style({
  boxShadow: shadowClass,
  aspectRatio: '1',
  cursor: 'pointer'
})

export const colorButtonSelected = style({
  boxShadow: `0 0 0 2px ${COLORS['bg-100']}, 0 0 0 4px ${COLORS['bg-900']}, var(--custom-shadow)`,
  selectors: {
    '.dark &': {
      boxShadow: `0 0 0 2px ${COLORS['bg-900']}, 0 0 0 4px ${COLORS['bg-50']}, var(--custom-shadow)`
    }
  }
})
