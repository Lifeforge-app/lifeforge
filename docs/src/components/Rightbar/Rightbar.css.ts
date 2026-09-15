import { style } from '@vanilla-extract/css'

import { COLORS } from '@lifeforge/ui'

export const sectionLink = style({
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: '50%',
      left: '-2px',
      width: '3px',
      height: 0,
      transform: 'translateY(-50%)',
      borderRadius: '9999px',
      backgroundColor: COLORS['custom-500'],
      transition: 'height 150ms ease'
    },
    '&[aria-current="page"]::before': {
      height: '100%'
    },
    '&[aria-current="page"]': {
      fontWeight: 600,
      color: `${COLORS['custom-500']} !important`
    },
    '&[aria-current="page"]:hover': {
      fontWeight: 600,
      color: COLORS['custom-500']
    }
  }
})
