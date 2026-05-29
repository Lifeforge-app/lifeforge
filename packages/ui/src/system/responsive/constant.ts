import type { Breakpoint, PropDef } from './types'

export const RESPONSIVE_CONDITIONS = {
  base: {},
  sm: { '@media': '(min-width: 640px)' },
  md: { '@media': '(min-width: 768px)' },
  lg: { '@media': '(min-width: 1024px)' },
  xl: { '@media': '(min-width: 1280px)' },
  '2xl': { '@media': '(min-width: 1536px)' }
} as const satisfies Record<Breakpoint, object>

export const LAYOUT_PROP_DEFS = {
  width: {
    className: 'lf-w',
    customProperties: ['--lf-w']
  },
  minWidth: {
    className: 'lf-min-w',
    customProperties: ['--lf-min-w']
  },
  maxWidth: {
    className: 'lf-max-w',
    customProperties: ['--lf-max-w']
  },
  height: {
    className: 'lf-h',
    customProperties: ['--lf-h']
  },
  minHeight: {
    className: 'lf-min-h',
    customProperties: ['--lf-min-h']
  },
  maxHeight: {
    className: 'lf-max-h',
    customProperties: ['--lf-max-h']
  },
  inset: {
    className: 'lf-inset',
    customProperties: ['--lf-inset']
  },
  top: {
    className: 'lf-t',
    customProperties: ['--lf-t']
  },
  right: {
    className: 'lf-r',
    customProperties: ['--lf-r']
  },
  bottom: {
    className: 'lf-b',
    customProperties: ['--lf-b']
  },
  left: {
    className: 'lf-l',
    customProperties: ['--lf-l']
  },
  flex: {
    className: 'lf-fl',
    customProperties: ['--lf-fl']
  },
  flexBasis: {
    className: 'lf-fb',
    customProperties: ['--lf-fb']
  },
  flexGrow: {
    className: 'lf-fg',
    customProperties: ['--lf-fg']
  },
  flexShrink: {
    className: 'lf-fs',
    customProperties: ['--lf-fs']
  },
  gridArea: {
    className: 'lf-ga',
    customProperties: ['--lf-ga']
  },
  gridColumnSpan: {
    className: 'lf-gcsp',
    customProperties: ['--lf-gcsp']
  },
  gridRowSpan: {
    className: 'lf-grsp',
    customProperties: ['--lf-grsp']
  },
  // Grid container props
  gridTemplateColumns: {
    className: 'lf-gtc',
    customProperties: ['--lf-gtc']
  },
  gridTemplateRows: {
    className: 'lf-gtr',
    customProperties: ['--lf-gtr']
  },
  zIndex: {
    className: 'lf-zi',
    customProperties: ['--lf-zi']
  },
  ringWidth: {
    className: 'lf-rw',
    customProperties: ['--lf-rw']
  },
  ringOffsetWidth: {
    className: 'lf-row',
    customProperties: ['--lf-row']
  }
} as const satisfies Record<string, PropDef>

export type LayoutPropDefsKey = keyof typeof LAYOUT_PROP_DEFS
