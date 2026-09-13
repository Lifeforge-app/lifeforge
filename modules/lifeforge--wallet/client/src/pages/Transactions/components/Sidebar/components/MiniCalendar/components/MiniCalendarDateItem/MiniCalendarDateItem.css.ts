import { style } from '@vanilla-extract/css'

import { COLORS, vars } from '@lifeforge/ui'

export const selectedBorderAfter = style({
  '::after': {
    content: '',
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: -1,
    height: '3rem',
    width: '100%',
    transform: 'translate(-50%, -50%)',
    borderColor: COLORS['custom-500']
  }
})

export const selectedBorderAfterStart = style({
  '::after': {
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderLeft: '1px solid',
    borderColor: COLORS['custom-500'],
    borderRadius: '0.25rem 0 0 0.25rem'
  }
})

export const selectedBorderAfterEnd = style({
  '::after': {
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderRight: '1px solid',
    borderColor: COLORS['custom-500'],
    borderRadius: '0 0.25rem 0.25rem 0'
  }
})

export const selectedBorderAfterSingle = style({
  '::after': {
    border: '1px solid',
    borderColor: COLORS['custom-500'],
    borderRadius: '0.25rem'
  }
})

export const betweenBorderAfter = style({
  '::after': {
    content: '',
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: -2,
    height: '3rem',
    width: '100%',
    transform: 'translate(-50%, -50%)',
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: COLORS['custom-500']
  }
})

export const transactionBar = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  zIndex: -1,
  display: 'flex',
  width: '2.5rem',
  height: '2.5rem',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: vars.radii.sm,
  transform: 'translate(-50%, -50%)'
})
