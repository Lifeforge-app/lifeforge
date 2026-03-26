import { style } from '@vanilla-extract/css'

import { bg, withOpacity } from '@/system'

// ── Outer wrapper ────────────────────────────────────────────────────────────

export const wrapper = style([
  {
    borderColor: withOpacity(bg[500], 0.2),
    selectors: {
      '.bordered &': {
        borderWidth: '2px',
        borderStyle: 'solid'
      }
    }
  }
])

// ── Default variant icon wrapper ──────────────────────────────────────────────

export const defaultIconWrapperNoColor = style({
  backgroundColor: withOpacity(bg[500], 0.1)
})

// ── Large-icon variant icon wrapper ───────────────────────────────────────────

export const largeIconWrapperNoColor = style({
  backgroundColor: withOpacity(bg[500], 0.1),
  selectors: {
    '.dark &': {
      backgroundColor: withOpacity(bg[800], 0.7)
    }
  }
})

// ── Large-icon variant icon ───────────────────────────────────────────────────

export const largeIcon = style({
  width: '2rem',
  height: '2.5rem',
  '@media': {
    '(min-width: 640px)': {
      width: '2.5rem',
      height: '2.5rem'
    }
  }
})
