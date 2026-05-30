import { recipe } from '@vanilla-extract/recipes'

import { vars } from '@/system'

export const textInputBoxRecipe = recipe({
  base: {
    width: '100%',
    backgroundColor: 'transparent',
    letterSpacing: '0.05em',
    borderRadius: 'var(--radius-lg)',
    outline: 'none'
  },
  variants: {
    variant: {
      classic: {
        marginTop: vars.space.md,
        padding: vars.space.md,
        paddingLeft: 0,
        paddingBottom: vars.space.sm
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
