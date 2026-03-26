import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

// interactive hover/cursor style used by TagChip
export const interactiveClass = style({
  cursor: 'pointer',
  transition: 'all 0.2s',
  selectors: {
    '&:hover': {
      filter: 'brightness(1.2)'
    }
  }
})

// fallback styles when no color prop is provided
export const noColorOutlined = style({
  color: bg[500],
  backgroundColor: bg[50],
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: bg[200],
  selectors: {
    '.dark &': {
      color: bg[400],
      borderColor: withOpacity(bg[700], 0.5)
    }
  }
})

export const noColorFilled = style({
  backgroundColor: bg[200],
  border: '1px solid transparent',
  selectors: {
    '.dark &': {
      backgroundColor: bg[800],
      color: bg[500]
    }
  }
})
