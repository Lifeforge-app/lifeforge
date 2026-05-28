import { bg, withOpacity } from '@/system'

export const plain = {
  backgroundColor: 'transparent',
  color: bg[500],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: withOpacity(bg[200], 0.5),
      color: bg[800]
    },
    '.dark &:hover:not(:disabled)': {
      backgroundColor: withOpacity(bg[800], 0.5),
      color: bg[50]
    },
    '&:disabled': {
      color: bg[300]
    },
    '.dark &:disabled': {
      color: bg[700]
    }
  }
} as const

export const plainDangerous = {
  color: 'var(--color-dangerous)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)',
      color: 'var(--color-dangerous)'
    },
    '.dark &:hover:not(:disabled)': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)',
      color: 'var(--color-dangerous)'
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
