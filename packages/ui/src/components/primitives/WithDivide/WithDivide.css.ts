import { style } from '@vanilla-extract/css'

export const divideBase = style({
  selectors: {
    '&:not(:first-child)': {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'var(--divide-color)'
    },
    '.dark &:not(:first-child)': {
      borderTopColor: 'var(--divide-dark-color)'
    }
  }
})
