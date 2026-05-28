import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { COLORS, vars, withOpacity } from '@/system'

export const inputWrapperRecipe = recipe({
  base: {
    transition: 'all 0.2s',
    backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
    selectors: {
      '.dark &': { backgroundColor: withOpacity(COLORS['bg-800'], 0.7) },
      '&:hover': { backgroundColor: COLORS['bg-200'] },
      '.dark &:hover': { backgroundColor: COLORS['bg-800'] }
    }
  },
  variants: {
    variant: {
      classic: {
        borderTopLeftRadius: vars.radii.lg,
        borderTopRightRadius: vars.radii.lg,
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        selectors: {
          '.bordered &': {
            borderRadius: vars.radii.lg,
            borderWidth: '2px',
            borderStyle: 'solid'
          }
        }
      },
      plain: {
        borderRadius: vars.radii.lg
      }
    },
    size: {
      default: {},
      small: {}
    },
    hasError: {
      true: {
        borderColor: 'var(--color-dangerous)',
        outlineColor: 'var(--color-dangerous)',
        selectors: {
          '&:focus-within': {
            borderColor: 'var(--color-dangerous)'
          }
        }
      },
      false: {
        borderColor: COLORS['bg-500'],
        selectors: {
          '&:focus-within': {
            borderColor: COLORS['custom-500']
          },
          '.bordered &': {
            borderColor: withOpacity(COLORS['bg-500'], 0.2)
          }
        }
      }
    },
    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none'
      },
      false: {
        cursor: 'text'
      }
    }
  },
  compoundVariants: [
    {
      variants: { variant: 'plain', size: 'default' },
      style: {
        padding: vars.space.md
      }
    },
    {
      variants: { variant: 'plain', size: 'small' },
      style: {
        padding: vars.space.sm
      }
    }
  ],
  defaultVariants: {
    variant: 'classic',
    size: 'default',
    hasError: false,
    disabled: false
  }
})

export const inputWrapperErrorTextStyle = style({
  color: 'var(--color-dangerous)'
})
