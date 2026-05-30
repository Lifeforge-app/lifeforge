import { COLORS, colorWithOpacity, shadowClass } from '@/system'

export const primary = {
  backgroundColor: COLORS['custom-500'],
  boxShadow: shadowClass,
  color: `var(--button-text-color, ${COLORS['bg-50']})`,
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS['custom-600']
    },
    '&:disabled': {
      backgroundColor: COLORS['bg-200'],
      color: COLORS['bg-400']
    },
    '.dark &:disabled': {
      backgroundColor: colorWithOpacity('bg-800', '50%').toString(),
      color: COLORS['bg-600']
    }
  }
} as const

export const primaryDangerous = {
  backgroundColor: COLORS['dangerous'],
  color: COLORS['bg-100'],
  selectors: {
    '.dark &': {
      color: COLORS['bg-800']
    },
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS['red-600']
    },
    '&:disabled': {
      backgroundColor: colorWithOpacity('dangerous', '10%').toString(),
      color: colorWithOpacity('dangerous', '70%').toString()
    },
    '.dark &:disabled': {
      backgroundColor: colorWithOpacity('dangerous', '10%').toString(),
      color: colorWithOpacity('dangerous', '70%').toString()
    }
  }
} as const
