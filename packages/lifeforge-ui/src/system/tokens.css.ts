import { createGlobalTheme } from '@vanilla-extract/css'

export const vars = createGlobalTheme(':root', {
  space: {
    none: '0',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  }
})

export type SpaceToken = keyof typeof vars.space
