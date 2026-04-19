import { style } from '@vanilla-extract/css'
import { createSprinkles } from '@vanilla-extract/sprinkles'

import { bg, custom, themeColorProperties, vars, withOpacity } from '@/system'

const sprinkles = createSprinkles(themeColorProperties)

export const iconWrapper = style({
  flexShrink: 0,
  width: '3.5rem',
  height: '3.5rem',
  backgroundColor: withOpacity(custom[500], 0.2),
  borderColor: withOpacity(custom[500], 0.3),
  selectors: {
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    }
  },
  '@media': {
    '(min-width: 640px)': {
      width: '4rem',
      height: '4rem'
    }
  }
})

export const moduleIcon = style({
  color: custom[500],
  width: '2rem',
  height: '2rem'
})

export const menuButton = style({
  color: bg[500],
  transition: 'all 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: withOpacity(bg[200], 0.5),
      color: bg[800]
    },
    '.dark &:hover': {
      backgroundColor: bg[900],
      color: bg[50]
    }
  }
})

export const tipsIcon = style({
  width: '1.25rem',
  height: '1.25rem'
})

export const menuItems = style([
  {
    width: '24rem',
    overflow: 'hidden',
    overscrollBehavior: 'contain',
    borderRadius: vars.radii.md,
    boxShadow:
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    outline: 'none',
    transition: 'all 0.1s ease-out',
    vars: { '--anchor-gap': '8px' },
    selectors: {
      '&:focus': { outline: 'none' },
      '&[data-closed]': { transform: 'scale(0.95)', opacity: 0 }
    }
  },
  sprinkles({ backgroundColor: { base: 'bg-100', dark: 'bg-800' } })
])

export const tipsHeaderIcon = style({
  width: '1.5rem',
  height: '1.5rem'
})
