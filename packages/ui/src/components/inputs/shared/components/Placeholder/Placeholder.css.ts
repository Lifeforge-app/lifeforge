import { recipe } from '@vanilla-extract/recipes'

import { COLORS } from '@/system'

export const placeholderRecipe = recipe({
  variants: {
    color: {
      transparent: {
        selectors: { '&::placeholder': { color: 'transparent' } }
      },
      default: {
        selectors: { '&::placeholder': { color: COLORS['bg-500'] } }
      }
    },
    focusColor: {
      transparent: {
        selectors: { '&:focus::placeholder': { color: 'transparent' } }
      },
      default: {
        selectors: { '&:focus::placeholder': { color: COLORS['bg-500'] } }
      }
    }
  },
  defaultVariants: {
    color: 'default',
    focusColor: 'default'
  }
})
