import { COLORS, withOpacity } from '@/system'

export const primary = {
  backgroundColor: COLORS['custom-500'],
  boxShadow: 'var(--custom-shadow)',
  color: `var(--button-text-color, ${COLORS['bg-50']})`,
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS['custom-600']
    },
    '&:disabled': {
      backgroundColor: COLORS['bg-200'],
      borderColor: withOpacity(COLORS['bg-500'], 0.2),
      color: COLORS['bg-400']
    },
    '.dark &:disabled': {
      backgroundColor: withOpacity(COLORS['bg-800'], 0.5),
      color: COLORS['bg-600']
    },
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: withOpacity(COLORS['custom-900'], 0.2)
    },
    '.dark.bordered &': {
      borderColor: COLORS['custom-900']
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
      color: 'color-mix(in srgb, var(--color-dangerous) 50%, transparent)'
    },
    '.bordered &': {
      borderColor: 'var(--color-dangerous)'
    }
  }
} as const
