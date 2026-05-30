import { style } from '@vanilla-extract/css'

import { vars } from '@/system'

export const wrapper = style({
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '0.25rem',
      borderRadius: vars.radii.full,
      backgroundColor: 'var(--_alert-stripe-color)'
    }
  }
})
