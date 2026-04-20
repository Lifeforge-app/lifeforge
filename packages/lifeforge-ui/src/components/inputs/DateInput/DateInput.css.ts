import { style } from '@vanilla-extract/css'

import { bg } from '@/system'

export const weekDayRed = style({
  // Tailwind red-500 — no system token available for this palette
  color: 'var(--color-red-500) !important'
})

export const weekDayMuted = style({
  color: `${bg[500]} !important`
})
