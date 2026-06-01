import { recipe } from '@vanilla-extract/recipes'

import { colorWithOpacity } from '@/system'

export const overlay = recipe({
  base: {
    overscrollBehavior: 'contain'
  },
  variants: {
    open: {
      true: { opacity: 1 },
      false: {
        opacity: 0
      }
    },
    topmost: {
      true: {
        backdropFilter: 'blur(2px)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        willChange: 'opacity, backdrop-filter',
        selectors: {
          '.dark &': {
            backgroundColor: colorWithOpacity('bg-950', '40%').toString()
          }
        }
      },
      false: {
        backgroundColor: 'transparent'
      }
    }
  }
})
