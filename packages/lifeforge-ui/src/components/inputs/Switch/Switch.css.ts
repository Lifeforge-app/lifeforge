import { recipe } from '@vanilla-extract/recipes'

import { vars } from '@/system'

export const switchRootRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: vars.space.lg,
    width: vars.space['2xl'],
    flexShrink: 0,
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: '9999px',
    border: '2px solid transparent',
    transition: 'background-color 200ms ease-in-out',
    outline: 'none'
  },
  variants: {
    checked: {
      true: {
        backgroundColor: 'var(--color-custom-500)'
      },
      false: {
        backgroundColor: 'var(--color-bg-300)',
        selectors: {
          '.dark &': {
            backgroundColor: 'var(--color-bg-600)'
          }
        }
      }
    },
    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.5
      },
      false: {}
    }
  },
  defaultVariants: {
    checked: false,
    disabled: false
  }
})

export const switchThumbRecipe = recipe({
  base: {
    pointerEvents: 'none',
    display: 'inline-block',
    width: vars.space.md, // 4
    height: vars.space.md, // 4
    borderRadius: '9999px',
    transition: 'transform 200ms ease-in-out'
  },
  variants: {
    checked: {
      true: {
        transform: 'translateX(calc(100% - var(--spacing)))'
      },
      false: {
        transform: 'translateX(calc(-100% + var(--spacing)))'
      }
    },
    colorMode: {
      light: {
        backgroundColor: 'var(--color-bg-100)'
      },
      dark: {
        backgroundColor: 'var(--color-bg-900)'
      },
      default: {
        backgroundColor: 'var(--color-bg-100)'
      }
    }
  },
  defaultVariants: {
    checked: false,
    colorMode: 'default'
  }
})
