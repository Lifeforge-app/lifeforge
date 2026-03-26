import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const checkboxWrapperStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem' // 3
})

export const checkboxRootRecipe = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 50,
    width: '1.5rem', // 6
    height: '1.5rem', // 6
    flexShrink: 0,
    cursor: 'pointer',
    borderRadius: '0.375rem', // rounded-md
    borderWidth: '2px',
    borderStyle: 'solid',
    transition: 'all 150ms ease-in-out',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5
      },
      '&[data-state="checked"]': {
        borderColor: 'var(--color-custom-500)',
        backgroundColor: 'var(--color-custom-500)'
      },
      '&[data-state="unchecked"]': {
        borderColor: 'var(--color-bg-300)',
        backgroundColor: 'transparent'
      },
      '.dark &[data-state="unchecked"]': {
        borderColor: 'var(--color-bg-600)'
      },
      '&[data-state="unchecked"]:hover': {
        borderColor: 'var(--color-bg-500)'
      },
      '.dark &[data-state="unchecked"]:hover': {
        borderColor: 'var(--color-bg-200)'
      }
    }
  }
})

export const checkboxIndicatorStyle = style({
  width: '1.25rem', // 5
  height: '1.25rem', // 5
  strokeWidth: '0.5px',
  transition: 'all 150ms ease-in-out'
})

export const checkboxIndicatorLightStyle = style({
  color: 'var(--color-bg-900)',
  stroke: 'var(--color-bg-900)'
})

export const checkboxIndicatorDarkStyle = style({
  color: 'var(--color-bg-100)',
  stroke: 'var(--color-bg-100)'
})
