import { recipe } from '@vanilla-extract/recipes'

import { bg, custom } from '@/system'

export const checkboxRootRecipe = recipe({
  base: {
    selectors: {
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
