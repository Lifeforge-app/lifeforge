import { recipe } from '@vanilla-extract/recipes'

export const textareaRecipe = recipe({
  base: {
    maxHeight: '32rem', // 128
    minHeight: '2rem', // 8
    width: '100%',
    resize: 'none',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'transparent',
    letterSpacing: '0.025em', // tracking-wide
    outline: 'none',
    selectors: {
      '&:focus': {
        outline: 'none'
      },
      '&:focus::placeholder': {
        color: 'var(--color-bg-400)'
      },
      '.dark &:focus::placeholder': {
        color: 'var(--color-bg-600)'
      }
    }
  },
  variants: {
    variant: {
      classic: {
        marginTop: '2.25rem', // 9
        paddingLeft: '1.5rem', // 6
        paddingRight: '1rem', // 4
        paddingBottom: '0.75rem', // 3
        paddingTop: 0,
        selectors: {
          '&::placeholder': {
            color: 'transparent'
          }
        }
      },
      plain: {
        padding: 0
      }
    }
  },
  defaultVariants: {
    variant: 'classic'
  }
})
