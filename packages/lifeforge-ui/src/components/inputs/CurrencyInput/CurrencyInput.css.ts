import { recipe } from '@vanilla-extract/recipes'

import { vars } from '@/system'

export const currencyInputContainerRecipe = recipe({
  variants: {
    variant: {
      classic: {
        marginTop: vars.space.lg, // 6
        height: vars.space.xl, // 8
        padding: vars.space.lg, // 6
        paddingLeft: vars.space.sm, // 4
      },
      plain: {
        height: '1.75rem', // 7
        padding: 0
      }
    }
  },
  defaultVariants: {
    variant: 'classic'
  }
})

export const currencyInputFieldRecipe = recipe({
  base: {
    width: '100%',
    backgroundColor: 'transparent',
    letterSpacing: '0.05em', // tracking-wider
    outline: 'none',
    selectors: {
      '&:focus': {
        outline: 'none'
      },
      '&:focus::placeholder': {
        color: 'var(--color-bg-500)'
      }
    }
  },
  variants: {
    variant: {
      classic: {
        selectors: {
          '&::placeholder': {
            color: 'transparent'
          }
        }
      },
      plain: {}
    }
  },
  defaultVariants: {
    variant: 'classic'
  }
})
