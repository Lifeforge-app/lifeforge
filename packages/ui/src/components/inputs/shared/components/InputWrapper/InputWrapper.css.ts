import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { COLORS, vars } from '@/system'

export const inputWrapperRecipe = recipe({
  variants: {
    variant: {
      classic: {
        borderTopLeftRadius: vars.radii.lg,
        borderTopRightRadius: vars.radii.lg,
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid'
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
        borderColor: COLORS['dangerous'],
        outlineColor: COLORS['dangerous'],
        selectors: {
          '&:focus-within': {
            borderColor: COLORS['dangerous']
          }
        }
      },
      false: {
        borderColor: COLORS['bg-500'],
        selectors: {
          '&:focus-within': {
            borderColor: COLORS['custom-500']
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
  color: COLORS['dangerous']
})
