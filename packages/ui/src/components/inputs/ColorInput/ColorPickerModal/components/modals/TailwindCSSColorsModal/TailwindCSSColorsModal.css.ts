import { style } from '@vanilla-extract/css'

import { vars } from '@/system'

export const colorGroupLabel = style({
  marginTop: vars.space.md,
  marginBottom: vars.space.md,
  width: '7rem',
  textAlign: 'left',
  '@media': {
    'screen and (min-width: 640px)': {
      marginBottom: vars.space.sm
    }
  }
})
