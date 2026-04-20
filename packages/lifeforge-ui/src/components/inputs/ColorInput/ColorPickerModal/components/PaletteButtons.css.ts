import { style } from '@vanilla-extract/css'

export const tailwindButton = style({
  backgroundColor: 'var(--color-teal-500) !important',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--color-teal-600) !important'
    }
  }
})
