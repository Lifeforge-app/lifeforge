import { style } from '@vanilla-extract/css'

const divideBase = style({
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

const divideYBase = style({
  selectors: {
    '&:not(:first-child)': {
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'var(--divide-color)'
    },
    '.dark &:not(:first-child)': {
      borderLeftColor: 'var(--divide-dark-color)'
    }
  }
})

export const divideVariants = {
  y: divideBase,
  x: divideYBase
} as const

export type DivideAxis = keyof typeof divideVariants
