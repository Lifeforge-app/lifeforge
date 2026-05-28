import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { COLORS, withOpacity } from '@/system'

export const overlay = recipe({
  base: {
    overscrollBehavior: 'contain',
    transition: 'opacity 200ms ease-out'
  },
  variants: {
    open: {
      true: { opacity: 1 },
      false: {
        opacity: 0,
        transition: 'z-index 0.1s linear 0.2s, opacity 0.2s ease-out'
      }
    },
    topmost: {
      true: {
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        willChange: 'opacity, backdrop-filter',
        selectors: {
          '.dark &': { backgroundColor: withOpacity(COLORS['bg-950'], 0.4) }
        }
      },
      false: {
        backgroundColor: 'transparent'
      }
    }
  }
})

export const dialog = style({
  borderColor: withOpacity(COLORS['bg-500'], 0.2),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  maxWidth: 'calc(100vw - 4rem)',
  transition: 'transform 200ms ease-out',
  width: '100%',
  willChange: 'transform',
  '@media': {
    '(min-width: 640px)': { maxWidth: 'calc(100vw - 8rem)' },
    '(min-width: 1024px)': { width: 'auto' }
  },
  selectors: {
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})
