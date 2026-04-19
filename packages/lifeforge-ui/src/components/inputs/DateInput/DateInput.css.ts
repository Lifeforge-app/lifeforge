import { style } from '@vanilla-extract/css'

import { bg, vars } from '@/system'

export const datePickerInputClassic = style({
  marginTop: vars.space.lg,
  height: '3.25rem',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.md,
  selectors: {
    '&::placeholder': { color: 'transparent' }
  }
})

export const datePickerInputPlain = style({
  height: '1.75rem',
  padding: '0'
})

export const weekDayRed = style({
  // Tailwind red-500 — no system token available for this palette
  color: 'var(--color-red-500) !important'
})

export const weekDayMuted = style({
  color: `${bg[500]} !important`
})
