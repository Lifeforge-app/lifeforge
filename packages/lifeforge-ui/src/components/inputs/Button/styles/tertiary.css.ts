import { bg, custom, withOpacity } from '@/system'

export const tertiary = {
  backgroundColor: 'transparent',
  color: custom[500],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: withOpacity(custom[500], 0.15),
      boxShadow: 'var(--custom-shadow)'
    },
    '&:disabled': {
      color: bg[300]
    },
    '.dark &:disabled': {
      color: bg[700]
    }
  }
} as const

export const tertiaryDangerous = {
  color: 'var(--color-dangerous)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)'
    },
    '&:disabled': {
      color: 'var(--color-dangerous)'
    },
    '.dark &:disabled': {
      color:
        'color-mix(in srgb, var(--color-dangerous) 50%, transparent)'
    }
  }
} as const
