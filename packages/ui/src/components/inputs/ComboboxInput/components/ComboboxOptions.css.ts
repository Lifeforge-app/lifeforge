import { style } from '@vanilla-extract/css'

export const options = style({
  selectors: {
    '&:empty': { visibility: 'hidden' },
    '&:focus': { outline: 'none' },
    '&[data-closed]': { transform: 'scale(0.95)', opacity: 0 }
  }
})
