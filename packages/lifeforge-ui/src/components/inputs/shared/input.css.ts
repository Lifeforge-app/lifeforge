import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

// ============================================================================
// InputWrapper Recipe
// ============================================================================

export const inputWrapperContainerStyle = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 'calc(var(--spacing) * 2)'
})

export const inputWrapperRecipe = recipe({
  base: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flexShrink: 0,
    alignItems: 'center',
    gap: 'calc(var(--spacing) * 1)',
    transition: 'all 150ms ease-in-out'
  },
  variants: {
    variant: {
      classic: {
        backgroundColor:
          'color-mix(in srgb, var(--color-bg-200) 50%, transparent)',
        boxShadow: 'var(--custom-shadow)',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        paddingLeft: 'calc(var(--spacing) * 6)',
        selectors: {
          '.dark &': {
            backgroundColor:
              'color-mix(in srgb, var(--color-bg-800) 70%, transparent)'
          },
          '&:hover': {
            backgroundColor: 'var(--color-bg-200)'
          },
          '.dark &:hover': {
            backgroundColor: 'var(--color-bg-800)'
          },
          '.bordered &': {
            borderRadius: 'var(--radius-lg)',
            borderWidth: '2px',
            borderStyle: 'solid'
          }
        }
      },
      plain: {
        backgroundColor:
          'color-mix(in srgb, var(--color-bg-200) 50%, transparent)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--custom-shadow)',
        selectors: {
          '.dark &': {
            backgroundColor:
              'color-mix(in srgb, var(--color-bg-800) 70%, transparent)'
          },
          '&:hover': {
            backgroundColor: 'var(--color-bg-200)'
          },
          '.dark &:hover': {
            backgroundColor: 'var(--color-bg-800)'
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
        borderColor: 'var(--color-bg-500)',
        selectors: {
          '&:focus-within': {
            borderColor: 'var(--color-custom-500)'
          },
          '.bordered &': {
            borderColor:
              'color-mix(in srgb, var(--color-bg-500) 20%, transparent)'
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

export const inputWrapperErrorIconStyle = style({
  marginRight: 'calc(var(--spacing) * 6)',
  width: '1.5rem',
  height: '1.5rem',
  color: 'var(--color-red-500)'
})

export const inputWrapperErrorTextStyle = style({
  paddingLeft: 'calc(var(--spacing) * 6)',
  paddingRight: 'calc(var(--spacing) * 6)',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-red-500)'
})

// ============================================================================
// InputLabel Styles
// ============================================================================

export const inputLabelBaseStyle = style({
  pointerEvents: 'none',
  position: 'absolute',
  left: 'calc(var(--spacing) * 17)',
  width: 'calc(100% - 5.75rem)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontWeight: 500,
  letterSpacing: '0.025em',
  transition: 'all 150ms ease-in-out',
  transform: 'translateY(-50%)'
})

export const inputLabelActiveStyle = style({
  top: 'calc(var(--spacing) * 5)',
  fontSize: 'var(--text-base)'
})

export const inputLabelInactiveStyle = style({
  top: '50%',
  fontSize: 'var(--text-sm)',
  selectors: {
    '.group:focus-within &': {
      top: 'calc(var(--spacing) * 5)',
      fontSize: 'var(--text-base)'
    },
    '.group[data-open] &': {
      top: 'calc(var(--spacing) * 5)',
      fontSize: 'var(--text-base)'
    }
  }
})

export const inputLabelErrorStyle = style({
  color: 'var(--color-red-500)',
  selectors: {
    '.group:focus-within &': {
      color: 'var(--color-red-500)'
    },
    '.group[data-open] &': {
      color: 'var(--color-red-500)'
    }
  }
})

export const inputLabelNormalStyle = style({
  color: 'var(--color-bg-500)',
  selectors: {
    '.group:focus-within &': {
      color: 'var(--color-custom-500)'
    },
    '.group[data-open] &': {
      color: 'var(--color-custom-500)'
    }
  }
})

export const inputLabelFocusedStyle = style({
  color: 'var(--color-custom-500)'
})

export const inputLabelRequiredStyle = style({
  color: 'var(--color-red-500)'
})

// ============================================================================
// InputIcon Styles
// ============================================================================

export const inputIconBaseStyle = style({
  pointerEvents: 'none',
  width: '1.5rem',
  height: '1.5rem',
  flexShrink: 0,
  transition: 'all 150ms ease-in-out'
})

export const inputIconInactiveStyle = style({
  color: 'var(--color-bg-500)'
})

export const inputIconPlainVariantStyle = style({
  marginRight: 'calc(var(--spacing) * 4)'
})

export const inputIconFocusedStyle = style({
  color: 'var(--color-custom-500)'
})

export const inputIconErrorStyle = style({
  color: 'var(--color-red-500)',
  selectors: {
    '.group:focus-within &': {
      color: 'var(--color-red-500)'
    },
    '.group[data-open] &': {
      color: 'var(--color-red-500)'
    }
  }
})

// ============================================================================
// TextInputBox Recipe
// ============================================================================

export const textInputBoxRecipe = recipe({
  base: {
    caretColor: 'var(--color-custom-500)',
    width: '100%',
    backgroundColor: 'transparent',
    letterSpacing: '0.05em',
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    selectors: {
      '&:focus::placeholder': {
        color: 'var(--color-bg-500)'
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

// ============================================================================
// Helper Styles
// ============================================================================

export const inputContentRowStyle = style({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: 'calc(var(--spacing) * 2)'
})
