import { style } from '@vanilla-extract/css'

import { bg, custom } from '@/system'

export const inputIconInactiveStyle = style({
  color: bg[500]
})

export const inputIconPlainVariantStyle = style({
  marginRight: 'calc(var(--spacing) * 4)'
})

export const inputIconFocusedStyle = style({
  color: custom[500]
})

export const inputIconErrorStyle = style({
  color: 'var(--color-red-500)',
  selectors: {
    '.group:focus-within &': {
      color: 'var(--color-red-500)'
    },
    '.group[data-open] &': {
      color: 'var(--color-red-500)'
    }
  }
})
