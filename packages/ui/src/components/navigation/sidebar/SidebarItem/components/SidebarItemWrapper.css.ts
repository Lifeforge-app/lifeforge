import { style } from '@vanilla-extract/css'

import { COLORS, vars } from '@/system'

export const listItemActiveIndicator = style({
  selectors: {
    '&::after': {
      content: "''",
      position: 'absolute',
      top: '50%',
      right: '0',
      height: '2rem',
      width: '0.25rem',
      transform: 'translateY(-50%)',
      borderRadius: vars.radii.full,
      backgroundColor: COLORS['custom-500']
    }
  }
})
