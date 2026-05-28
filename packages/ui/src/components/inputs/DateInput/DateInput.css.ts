import { style } from '@vanilla-extract/css'

import { COLORS } from '@/system'

export const weekDayRed = style({
  color: 'var(--color-dangerous) !important'
})

export const weekDayMuted = style({
  color: `${COLORS['bg-500']} !important`
})
