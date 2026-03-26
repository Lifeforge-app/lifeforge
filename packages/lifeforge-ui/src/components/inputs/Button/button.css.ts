import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const buttonRecipe = recipe({
  base: {
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'calc(var(--spacing) * 2)',
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-lg)',
    padding: 'calc(var(--spacing) * 4)',
    fontWeight: 500,
    letterSpacing: '0.025em',
    transition: 'all 150ms ease-in-out',
    border: 'none',
    outline: 'none',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed'
      }
    }
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'var(--color-custom-500)',
        boxShadow: 'var(--custom-shadow)',
        color: 'var(--button-text-color, var(--color-bg-50))',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-custom-600)'
          },
          '&:disabled': {
            backgroundColor: 'var(--color-bg-200)',
            borderColor:
              'color-mix(in srgb, var(--color-bg-500) 20%, transparent)',
            color: 'var(--color-bg-400)'
          },
          '.dark &:disabled': {
            backgroundColor:
              'color-mix(in srgb, var(--color-bg-800) 50%, transparent)',
            color: 'var(--color-bg-600)'
          },
          '.bordered &': {
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor:
              'color-mix(in srgb, var(--color-custom-900) 20%, transparent)'
          },
          '.dark.bordered &': {
            borderColor: 'var(--color-custom-900)'
          }
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: '1.6px',
        borderStyle: 'solid',
        borderColor: 'var(--color-custom-500)',
        boxShadow: 'var(--custom-shadow)',
        color: 'var(--color-custom-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-custom-500) 10%, transparent)'
          },
          '&:disabled': {
            borderColor: 'var(--color-bg-300)',
            color: 'var(--color-bg-300)'
          },
          '.dark &:disabled': {
            borderColor: 'var(--color-bg-700)',
            color: 'var(--color-bg-700)'
          }
        }
      },
      tertiary: {
        backgroundColor: 'transparent',
        color: 'var(--color-custom-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-custom-500) 15%, transparent)',
            boxShadow: 'var(--custom-shadow)'
          },
          '&:disabled': {
            color: 'var(--color-bg-300)'
          },
          '.dark &:disabled': {
            color: 'var(--color-bg-700)'
          }
        }
      },
      plain: {
        backgroundColor: 'transparent',
        color: 'var(--color-bg-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-bg-200) 50%, transparent)',
            color: 'var(--color-bg-800)'
          },
          '.dark &:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-bg-800) 50%, transparent)',
            color: 'var(--color-bg-50)'
          },
          '&:disabled': {
            color: 'var(--color-bg-300)'
          },
          '.dark &:disabled': {
            color: 'var(--color-bg-700)'
          }
        }
      }
    },
    dangerous: {
      true: {}
    },
    hasIconWithChildren: {
      start: {
        paddingRight: 'calc(var(--spacing) * 5)'
      },
      end: {
        paddingLeft: 'calc(var(--spacing) * 5)'
      },
      false: {}
    }
  },
  compoundVariants: [
    {
      variants: { variant: 'primary', dangerous: true },
      style: {
        backgroundColor: 'var(--color-red-500)',
        color: 'var(--button-text-color, var(--color-bg-50))',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-red-600)'
          },
          '&:disabled': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)',
            borderColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)',
            color: 'var(--color-red-300)'
          },
          '.dark &:disabled': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)',
            color: 'color-mix(in srgb, var(--color-red-900) 50%, transparent)'
          },
          '.bordered &': {
            borderColor: 'var(--color-red-900)'
          }
        }
      }
    },
    {
      variants: { variant: 'secondary', dangerous: true },
      style: {
        borderColor: 'var(--color-red-500)',
        color: 'var(--color-red-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 15%, transparent)'
          },
          '&:disabled': {
            borderColor: 'var(--color-red-300)',
            color: 'var(--color-red-300)'
          },
          '.dark &:disabled': {
            borderColor:
              'color-mix(in srgb, var(--color-red-900) 50%, transparent)',
            color: 'color-mix(in srgb, var(--color-red-900) 50%, transparent)'
          }
        }
      }
    },
    {
      variants: { variant: 'tertiary', dangerous: true },
      style: {
        color: 'var(--color-red-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)'
          },
          '&:disabled': {
            color: 'var(--color-red-300)'
          },
          '.dark &:disabled': {
            color: 'color-mix(in srgb, var(--color-red-900) 50%, transparent)'
          }
        }
      }
    },
    {
      variants: { variant: 'plain', dangerous: true },
      style: {
        color: 'var(--color-red-500)',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)',
            color: 'var(--color-red-500)'
          },
          '.dark &:hover:not(:disabled)': {
            backgroundColor:
              'color-mix(in srgb, var(--color-red-500) 10%, transparent)',
            color: 'var(--color-red-500)'
          },
          '&:disabled': {
            color: 'var(--color-red-300)'
          },
          '.dark &:disabled': {
            color: 'color-mix(in srgb, var(--color-red-900) 50%, transparent)'
          }
        }
      }
    }
  ],
  defaultVariants: {
    variant: 'primary',
    dangerous: false,
    hasIconWithChildren: false
  }
})

export type ButtonVariants = Parameters<typeof buttonRecipe>[0]

export const buttonIconStyle = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0
})

export const buttonTextStyle = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})
