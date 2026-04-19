import { style } from '@vanilla-extract/css'

import { bg, custom } from '@/system'

export const inputLabelBaseStyle = style({
  pointerEvents: 'none',
  position: 'absolute',
  left: 'calc(var(--spacing) * 17)',
  width: 'calc(100% - 5.75rem)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontWeight: 500,
  letterSpacing: '0.025em',
  transition: 'all 150ms ease-in-out',
  transform: 'translateY(-50%)'
})

export const inputLabelActiveStyle = style({
  top: 'calc(var(--spacing) * 5)',
  fontSize: 'var(--text-sm)'
})

export const inputLabelInactiveStyle = style({
  top: '50%',
  fontSize: 'var(--text-base)',
  selectors: {
    '.group:focus-within &': {
      top: 'calc(var(--spacing) * 5)',
      fontSize: 'var(--text-sm)'
    },
    '.group[data-open] &': {
      top: 'calc(var(--spacing) * 5)',
      fontSize: 'var(--text-sm)'
    }
  }
})

export const inputLabelErrorStyle = style({
  color: 'var(--color-red-500)',
  selectors: {
    '.group:focus-within &': {
      color: 'var(--color-red-500)'
    },
    '.group[data-open] &': {
      color: 'var(--color-red-500)'
    }
  }
})

export const inputLabelNormalStyle = style({
  color: bg[500],
  selectors: {
    '.group:focus-within &': {
      color: custom[500]
    },
    '.group[data-open] &': {
      color: custom[500]
    }
  }
})

export const inputLabelFocusedStyle = style({
  color: custom[500]
})

export const inputLabelRequiredStyle = style({
  color: 'var(--color-red-500)'
})
