import { style } from '@vanilla-extract/css'

export const iconHidden = style({
  opacity: 0,
  pointerEvents: 'none',
  selectors: {
    '.group:focus-within &': { opacity: 1 }
  }
})
