import { style } from '@vanilla-extract/css'

import { bg } from '@/styles/vanilla-extract'
import { withOpacity } from '@/styles/vanilla-extract/utils'

import { vars } from '../../../system'

// ── Outer wrapper ────────────────────────────────────────────────────────────

export const wrapper = style({
  boxShadow: 'var(--custom-shadow)',
  backgroundColor: bg[50],
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

export const defaultIconWrapper = style({
  borderRadius: vars.radii.md
})

export const defaultIconWrapperWithDesc = style({
  width: '2.75rem',
  height: '2.75rem'
})

export const defaultIconWrapperNoDesc = style({
  width: '2.25rem',
  height: '2.25rem'
})

export const defaultIconWrapperNoColor = style({
  backgroundColor: withOpacity(bg[500], 0.1)
})

// ── Default variant icon ──────────────────────────────────────────────────────

export const defaultIcon = style({
  width: '1.25rem',
  height: '1.25rem',
  flexShrink: 0
})

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
