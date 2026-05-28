import { style } from '@vanilla-extract/css'

import { COLORS, vars, withOpacity } from '@/system'

export const listItemBase = style({
  isolation: 'isolate',
  transition: 'all 0.2s'
})

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

export const innerButtonInteractive = style({
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.1s',
  whiteSpace: 'nowrap'
})

export const innerButtonActive = style({
  backgroundColor: withOpacity(COLORS['bg-200'], 0.5),
  boxShadow: 'var(--custom-shadow)',
  borderColor: withOpacity(COLORS['bg-500'], 0.2),
  selectors: {
    '.dark &': { backgroundColor: COLORS['bg-800'] },
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})

export const innerButtonInactive = style({
  selectors: {
    '&:hover': { backgroundColor: withOpacity(COLORS['bg-200'], 0.3) },
    '.dark &:hover': { backgroundColor: withOpacity(COLORS['bg-800'], 0.3) }
  }
})
