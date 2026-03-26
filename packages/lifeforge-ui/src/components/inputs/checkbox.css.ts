import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { bg, custom } from '@/styles/vanilla-extract'
import { vars } from '@/system'

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
    width: vars.space.lg,
    height: vars.space.lg,
    flexShrink: 0,
    cursor: 'pointer',
    borderRadius: vars.radii.md,
    borderWidth: '2px',
    borderStyle: 'solid',
    transition: 'all 150ms ease-in-out',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5
      },
      '&[data-state="checked"]': {
        borderColor: custom[500],
        backgroundColor: custom[500]
      },
      '&[data-state="unchecked"]': {
        borderColor: bg[300],
        backgroundColor: 'transparent'
      },
      '.dark &[data-state="unchecked"]': {
        borderColor: bg[600]
      },
      '&[data-state="unchecked"]:hover': {
        borderColor: bg[500]
      },
      '.dark &[data-state="unchecked"]:hover': {
        borderColor: bg[200]
      }
    }
  }
})

export const checkboxIndicatorStyle = style({
  width: vars.space.lg,
  height: vars.space.lg,
  strokeWidth: '0.5px',
  transition: 'all 150ms ease-in-out',
  selectors: {
    '&.light': {
      color: bg[900],
      stroke: bg[900]
    },
    '&.dark': {
      color: bg[100],
      stroke: bg[100]
    }
  }
})