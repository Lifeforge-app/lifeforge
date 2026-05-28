import { bg, custom, withOpacity } from '@/system'

export const secondary = {
  backgroundColor: 'transparent',
  borderWidth: '1.6px',
  borderStyle: 'solid',
  borderColor: custom[500],
  boxShadow: 'var(--custom-shadow)',
  color: custom[500],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: withOpacity(custom[500], 0.1)
    },
    '&:disabled': {
      borderColor: bg[300],
      color: bg[300]
    },
    '.dark &:disabled': {
      borderColor: bg[700],
      color: bg[700]
    }
  }
} as const

export const secondaryDangerous = {
  borderColor: 'var(--color-dangerous)',
  color: 'var(--color-dangerous)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 15%, transparent)'
    },
    '&:disabled': {
      borderColor: 'var(--color-dangerous)',
      color: 'var(--color-dangerous)'
    },
    '.dark &:disabled': {
      borderColor:
        'color-mix(in srgb, var(--color-dangerous) 50%, transparent)',
      color:
        'color-mix(in srgb, var(--color-dangerous) 50%, transparent)'
    }
  }
} as const
