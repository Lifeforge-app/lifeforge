import { globalStyle, style } from '@vanilla-extract/css'

import { COLORS } from '@/system'

export const track = style({
  position: 'relative',
  height: '1rem',
  borderRadius: '9999px',
  width: '100%'
})

export const fill = style({
  height: '1rem',
  borderRadius: '9999px',
  backgroundColor: COLORS['custom-500']
})

export const input = style({
  width: '100%',
  height: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  background: 'transparent',
  margin: 0,
  cursor: 'pointer',
  accentColor: COLORS['custom-500'],
  position: 'absolute',
  inset: 0,
  zIndex: 2
})

export const inputDisabled = style({
  opacity: 0.5,
  pointerEvents: 'none',
  cursor: 'not-allowed'
})

globalStyle(`${input}::-webkit-slider-thumb`, {
  appearance: 'none',
  WebkitAppearance: 'none',
  height: '1em',
  width: '1em',
  borderRadius: '9999px',
  background: COLORS['custom-500'],
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: COLORS['bg-50'],
  boxShadow: 'var(--custom-shadow)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease'
})

globalStyle(`${input}:hover::-webkit-slider-thumb`, {
  transform: 'scale(1.25)'
})

globalStyle(`${input}::-moz-range-thumb`, {
  height: '1em',
  width: '1em',
  borderRadius: '9999px',
  background: COLORS['custom-500'],
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: COLORS['bg-50'],
  boxShadow: 'var(--custom-shadow)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease'
})

globalStyle(`${input}:hover::-moz-range-thumb`, {
  transform: 'scale(1.25)'
})
