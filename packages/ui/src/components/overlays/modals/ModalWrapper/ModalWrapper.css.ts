import { recipe } from '@vanilla-extract/recipes'

import { colorWithOpacity } from '@/system'

export const dialog = recipe({
  variants: {
    open: {
      true: { pointerEvents: 'auto' },
      false: { pointerEvents: 'none' }
    }
  }
})

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

export const panel = recipe({
  base: {
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    willChange: 'transform'
  },
  variants: {
    open: {
      true: { opacity: 1 },
      false: { opacity: 0 }
    },
    topmost: {
      true: {},
      false: {}
    }
  },
  compoundVariants: [
    {
      variants: { open: true, topmost: true },
      style: { transform: 'translate(-50%, -50%) scale(1)' }
    },
    {
      variants: { open: true, topmost: false },
      style: { transform: 'translate(-50%, -50%) scale(0.95)' }
    },
    {
      variants: { open: false, topmost: true },
      style: { transform: 'translate(-50%, -50%) scale(0.9)' }
    },
    {
      variants: { open: false, topmost: false },
      style: { transform: 'translate(-50%, -50%) scale(0.9)' }
    }
  ]
})
