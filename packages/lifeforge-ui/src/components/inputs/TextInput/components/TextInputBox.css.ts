import { recipe } from '@vanilla-extract/recipes'

import { bg, custom } from '@/system'

export const textInputBoxRecipe = recipe({
  base: {
    caretColor: custom[500],
    width: '100%',
    backgroundColor: 'transparent',
    letterSpacing: '0.05em',
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    selectors: {
      '&:focus::placeholder': {
        color: bg[500]
      }
    }
  },
  variants: {
    variant: {
      classic: {
        marginTop: 'calc(var(--spacing) * 6)',
        height: '3.25rem',
        padding: 'calc(var(--spacing) * 6)',
        paddingLeft: 'calc(var(--spacing) * 4)',
        selectors: {
          '&::placeholder': {
            color: 'transparent'
          }
        }
      },
      plain: {
        padding: 0,
        height: '1.75rem'
      }
    },
    size: {
      default: {},
      small: {}
    }
  },
  compoundVariants: [
    {
      variants: { variant: 'plain', size: 'small' },
      style: {
        height: '1.25rem',
        fontSize: 'var(--text-sm)'
      }
    }
  ],
  defaultVariants: {
    variant: 'classic',
    size: 'default'
  }
})
