import { style } from '@vanilla-extract/css'

export const today = style({
  fontWeight: 600,
  '::after': {
    content: '',
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: -1,
    width: '3rem',
    height: '3rem',
    transform: 'translateX(-50%) translateY(-1.25rem)',
    borderRadius: '0.375rem',
    border: '1px solid var(--color-custom-500)',
    backgroundColor:
      'color-mix(in srgb, var(--color-custom-500) 10%, transparent)'
  }
})
