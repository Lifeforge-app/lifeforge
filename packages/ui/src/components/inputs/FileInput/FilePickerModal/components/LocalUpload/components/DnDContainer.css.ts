import { style } from '@vanilla-extract/css'

import { COLORS, withOpacity } from '@/system'

export const dndWrapper = style({
  cursor: 'pointer',
  borderWidth: '3px',
  transition: 'all 0.2s'
})

export const dndWrapperActive = style({
  borderStyle: 'solid',
  borderColor: COLORS['custom-500'],
  backgroundColor: withOpacity(COLORS['custom-500'], 0.05)
})

export const dndWrapperInactive = style({
  borderStyle: 'dashed',
  borderColor: COLORS['bg-500']
})
