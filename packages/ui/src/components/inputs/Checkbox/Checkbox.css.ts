import { recipe } from '@vanilla-extract/recipes'

import { COLORS } from '@/system'

export const checkboxRootRecipe = recipe({
  base: {
    selectors: {
      '&[data-state="checked"]': {
        borderColor: COLORS['custom-500'],
        backgroundColor: COLORS['custom-500']
      },
      '&[data-state="unchecked"]': {
        borderColor: COLORS['bg-300'],
        backgroundColor: 'transparent'
      },
      '.dark &[data-state="unchecked"]': {
        borderColor: COLORS['bg-600']
      },
      '&[data-state="unchecked"]:hover': {
        borderColor: COLORS['bg-500']
      },
      '.dark &[data-state="unchecked"]:hover': {
        borderColor: COLORS['bg-200']
      }
    }
  }
})
