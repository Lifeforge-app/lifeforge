import { globalStyle, style } from '@vanilla-extract/css'

import { bg, custom } from '@/system'

export const track = style({
  position: 'relative',
  height: '1rem',
  borderRadius: '9999px',
  width: '100%'
})

export const fill = style({
  height: '1rem',
  borderRadius: '9999px',
  backgroundColor: custom[500]
})

export const input = style({
  width: '100%',
  height: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  background: 'transparent',
  margin: 0,
  cursor: 'pointer',
  accentColor: custom[500],
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
  background: custom[500],
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: bg[50],
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
  background: custom[500],
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: bg[50],
  boxShadow: 'var(--custom-shadow)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease'
})

globalStyle(`${input}:hover::-moz-range-thumb`, {
  transform: 'scale(1.25)'
})
