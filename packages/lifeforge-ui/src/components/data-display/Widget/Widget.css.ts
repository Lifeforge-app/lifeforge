import { style } from '@vanilla-extract/css'

import { bg, vars, withOpacity } from '@/system'

// ── Outer wrapper ────────────────────────────────────────────────────────────

export const wrapper = style({
  boxShadow: 'var(--custom-shadow)',
  borderColor: withOpacity(bg[500], 0.2),
  borderRadius: vars.radii.lg,
  selectors: {
    '.dark &': {
      backgroundColor: bg[900]
    },
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    }
  }
})

// ── Default variant icon wrapper ──────────────────────────────────────────────

export const defaultIconWrapperNoColor = style({
  backgroundColor: withOpacity(bg[500], 0.1)
})

// ── Default variant icon ──────────────────────────────────────────────────────

export const defaultIconNoColor = style({
  color: bg[500],
  selectors: {
    '.dark &': {
      color: bg[50]
    }
  }
})

// ── Large-icon variant icon wrapper ───────────────────────────────────────────

export const largeIconWrapper = style({
  boxShadow: 'var(--custom-shadow)',
  borderRadius: vars.radii.lg
})

export const largeIconWrapperNoColor = style({
  backgroundColor: bg[100],
  selectors: {
    '.dark &': {
      backgroundColor: withOpacity(bg[800], 0.5)
    }
  }
})

// ── Large-icon variant icon ───────────────────────────────────────────────────

export const largeIcon = style({
  fontSize: vars.fontSize['2xl'],
  '@media': {
    '(min-width: 640px)': {
      fontSize: vars.fontSize['3xl']
    }
  }
})

export const largeIconNoColor = style({
  color: bg[500],
  selectors: {
    '.dark &': {
      color: bg[50]
    }
  }
})

// ── h3 title text (color only — size via Text prop, truncate via Text prop) ───

export const titleTextDefault = style({
  color: bg[500],
  selectors: {
    '.dark &': {
      color: bg[50]
    }
  }
})
