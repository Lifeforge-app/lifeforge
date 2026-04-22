import { recipe } from '@vanilla-extract/recipes'

import { bg, custom, withOpacity } from '@/system'

export const buttonRecipe = recipe({
  variants: {
    variant: {
      primary: {
        backgroundColor: custom[500],
        boxShadow: 'var(--custom-shadow)',
        color: `var(--button-text-color, ${bg[50]})`,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: custom[600]
          },
          '&:disabled': {
            backgroundColor: bg[200],
            borderColor: withOpacity(bg[500], 0.2),
            color: bg[400]
          },
          '.dark &:disabled': {
            backgroundColor: withOpacity(bg[800], 0.5),
            color: bg[600]
          },
          '.bordered &': {
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: withOpacity(custom[900], 0.2)
          },
          '.dark.bordered &': {
            borderColor: custom[900]
          }
        }
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: '1.6px',
        borderStyle: 'solid',
        borderColor: custom[500],
        boxShadow: 'var(--custom-shadow)',
        color: custom[500],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: withOpacity(custom[500], 0.1)
          },
          '&:disabled': {
            borderColor: bg[300],
            color: bg[300]
          },
          '.dark &:disabled': {
            borderColor: bg[700],
            color: bg[700]
          }
        }
      },
      tertiary: {
        backgroundColor: 'transparent',
        color: custom[500],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: withOpacity(custom[500], 0.15),
            boxShadow: 'var(--custom-shadow)'
          },
          '&:disabled': {
            color: bg[300]
          },
          '.dark &:disabled': {
            color: bg[700]
          }
        }
      },
      plain: {
        backgroundColor: 'transparent',
        color: bg[500],
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: withOpacity(bg[200], 0.5),
            color: bg[800]
          },
          '.dark &:hover:not(:disabled)': {
            backgroundColor: withOpacity(bg[800], 0.5),
            color: bg[50]
          },
          '&:disabled': {
            color: bg[300]
          },
          '.dark &:disabled': {
            color: bg[700]
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
        color: `var(--button-text-color, ${bg[50]})`,
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
