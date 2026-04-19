import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { bg, custom, withOpacity } from '@/system'

export const inputWrapperRecipe = recipe({
  variants: {
    variant: {
      classic: {
        backgroundColor: withOpacity(bg[200], 0.5),
        boxShadow: 'var(--custom-shadow)',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        paddingLeft: 'calc(var(--spacing) * 6)',
        selectors: {
          '.dark &': {
            backgroundColor: withOpacity(bg[800], 0.7)
          },
          '&:hover': {
            backgroundColor: bg[200]
          },
          '.dark &:hover': {
            backgroundColor: bg[800]
          },
          '.bordered &': {
            borderRadius: 'var(--radius-lg)',
            borderWidth: '2px',
            borderStyle: 'solid'
          }
        }
      },
      plain: {
        backgroundColor: withOpacity(bg[200], 0.5),
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--custom-shadow)',
        selectors: {
          '.dark &': {
            backgroundColor: withOpacity(bg[800], 0.7)
          },
          '&:hover': {
            backgroundColor: bg[200]
          },
          '.dark &:hover': {
            backgroundColor: bg[800]
          }
        }
      }
    },
    size: {
      default: {},
      small: {}
    },
    hasError: {
      true: {
        borderColor: 'var(--color-red-500)',
        selectors: {
          '&:focus-within': {
            borderColor: 'var(--color-red-500)'
          }
        }
      },
      false: {
        borderColor: bg[500],
        selectors: {
          '&:focus-within': {
            borderColor: custom[500]
          },
          '.bordered &': {
            borderColor: withOpacity(bg[500], 0.2)
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
        padding: 'calc(var(--spacing) * 4)',
        paddingLeft: 'calc(var(--spacing) * 5)',
        paddingRight: 'calc(var(--spacing) * 5)'
      }
    },
    {
      variants: { variant: 'plain', size: 'small' },
      style: {
        padding: 'calc(var(--spacing) * 2)',
        paddingLeft: 'calc(var(--spacing) * 3)',
        paddingRight: 'calc(var(--spacing) * 3)'
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
  paddingLeft: 'calc(var(--spacing) * 6)',
  paddingRight: 'calc(var(--spacing) * 6)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-red-500)'
})
