import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const currencyInputContainerRecipe = recipe({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem' // 2
  },
  variants: {
    variant: {
      classic: {
        marginTop: '1.5rem', // 6
        height: '2rem', // 8
        padding: '1.5rem', // 6
        paddingLeft: '1rem' // 4
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

export const currencySymbolStyle = style({
  color: 'var(--color-bg-400)',
  selectors: {
    '.dark &': {
      color: 'var(--color-bg-600)'
    }
  }
})

export const currencyInputFieldRecipe = recipe({
  base: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
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
