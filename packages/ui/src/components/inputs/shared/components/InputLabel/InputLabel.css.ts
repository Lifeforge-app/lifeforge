import { style } from '@vanilla-extract/css'

export const inputLabelActiveStyle = style({
  top: 'calc(var(--spacing) * 5)',
  fontSize: 'var(--text-sm)'
})

export const inputLabelInactiveStyle = style({
  top: '50%',
  fontSize: 'var(--text-base)'
})
