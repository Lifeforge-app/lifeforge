import { style } from '@vanilla-extract/css'

const divideBase = style({
  selectors: {
    '&:not(:first-child)': {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'var(--lf-divide-color)'
    },
    '.dark &:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-dark, var(--lf-divide-color))'
    },
    '&:hover:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-hover, var(--lf-divide-color))'
    },
    '.dark &:hover:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-dark-hover, var(--lf-divide-color-dark, var(--lf-divide-color-hover, var(--lf-divide-color))))'
    },
    '.has-bg-image &:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-has-bg-image, var(--lf-divide-color))'
    },
    '.dark .has-bg-image &:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-dark-has-bg-image, var(--lf-divide-color-dark, var(--lf-divide-color-has-bg-image, var(--lf-divide-color))))'
    },
    '.has-bg-image &:hover:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-has-bg-image-hover, var(--lf-divide-color-hover, var(--lf-divide-color-has-bg-image, var(--lf-divide-color))))'
    },
    '.dark .has-bg-image &:hover:not(:first-child)': {
      borderTopColor: 'var(--lf-divide-color-has-bg-image-dark-hover, var(--lf-divide-color-dark-hover, var(--lf-divide-color-has-bg-image-hover, var(--lf-divide-color-dark-has-bg-image, var(--lf-divide-color-dark, var(--lf-divide-color))))))'
    }
  }
})

const divideYBase = style({
  selectors: {
    '&:not(:first-child)': {
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'var(--lf-divide-color)'
    },
    '.dark &:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-dark, var(--lf-divide-color))'
    },
    '&:hover:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-hover, var(--lf-divide-color))'
    },
    '.dark &:hover:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-dark-hover, var(--lf-divide-color-dark, var(--lf-divide-color-hover, var(--lf-divide-color))))'
    },
    '.has-bg-image &:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-has-bg-image, var(--lf-divide-color))'
    },
    '.dark .has-bg-image &:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-dark-has-bg-image, var(--lf-divide-color-dark, var(--lf-divide-color-has-bg-image, var(--lf-divide-color))))'
    },
    '.has-bg-image &:hover:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-has-bg-image-hover, var(--lf-divide-color-hover, var(--lf-divide-color-has-bg-image, var(--lf-divide-color))))'
    },
    '.dark .has-bg-image &:hover:not(:first-child)': {
      borderLeftColor: 'var(--lf-divide-color-has-bg-image-dark-hover, var(--lf-divide-color-dark-hover, var(--lf-divide-color-has-bg-image-hover, var(--lf-divide-color-dark-has-bg-image, var(--lf-divide-color-dark, var(--lf-divide-color))))))'
    }
  }
})

export const divideVariants = {
  y: divideBase,
  x: divideYBase
} as const

export type DivideAxis = keyof typeof divideVariants
