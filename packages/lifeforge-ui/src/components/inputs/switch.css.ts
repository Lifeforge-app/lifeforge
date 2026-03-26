import { recipe } from '@vanilla-extract/recipes'

export const switchRootRecipe = recipe({
  base: {
    position: 'relative',
    display: 'inline-flex',
    height: '1.5rem', // 6
    width: '2.75rem', // 11
    flexShrink: 0,
    cursor: 'pointer',
    alignItems: 'center',
    borderRadius: '9999px',
    border: '2px solid transparent',
    transition:
      'background-color 200ms ease-in-out, box-shadow 200ms ease-in-out',
    outline: 'none',
    selectors: {
      '&:focus-visible': {
        outline: 'none',
        boxShadow:
          '0 0 0 2px var(--color-bg-50), 0 0 0 4px var(--color-custom-500)'
      },
      '.dark &:focus-visible': {
        boxShadow:
          '0 0 0 2px var(--color-bg-900), 0 0 0 4px var(--color-custom-500)'
      }
    }
  },
  variants: {
    checked: {
      true: {
        backgroundColor: 'var(--color-custom-500)',
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
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
    width: '1rem', // 4
    height: '1rem', // 4
    borderRadius: '9999px',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'transform 200ms ease-in-out'
  },
  variants: {
    checked: {
      true: {
        transform: 'translateX(1.4rem)' // 6
      },
      false: {
        transform: 'translateX(0.15rem)' // 1
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
