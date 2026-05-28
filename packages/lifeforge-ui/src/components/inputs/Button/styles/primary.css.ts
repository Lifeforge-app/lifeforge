import { bg, custom, withOpacity } from '@/system'

export const primary = {
  backgroundColor: custom[500],
  boxShadow: 'var(--custom-shadow)',
  color: `var(--button-text-color, ${bg[50]})`,
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: custom[600]
    },
    '&:disabled': {
      backgroundColor: bg[200],
      borderColor: withOpacity(bg[500], 0.2),
      color: bg[400]
    },
    '.dark &:disabled': {
      backgroundColor: withOpacity(bg[800], 0.5),
      color: bg[600]
    },
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: withOpacity(custom[900], 0.2)
    },
    '.dark.bordered &': {
      borderColor: custom[900]
    }
  }
} as const

export const primaryDangerous = {
  backgroundColor: 'var(--color-dangerous)',
  color: `var(--button-text-color, var(--color-bg-50))`,
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-dangerous)'
    },
    '&:disabled': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)',
      borderColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)',
      color: 'var(--color-dangerous)'
    },
    '.dark &:disabled': {
      backgroundColor:
        'color-mix(in srgb, var(--color-dangerous) 10%, transparent)',
      color:
        'color-mix(in srgb, var(--color-dangerous) 50%, transparent)'
    },
    '.bordered &': {
      borderColor: 'var(--color-dangerous)'
    }
  }
} as const
