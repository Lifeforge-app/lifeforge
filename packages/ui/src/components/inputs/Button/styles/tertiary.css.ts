import { COLORS, colorWithOpacity, shadowClass } from '@/system'

export const tertiary = {
  backgroundColor: 'transparent',
  color: COLORS['custom-500'],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colorWithOpacity('custom-500', '10%').toString(),
      boxShadow: shadowClass
    },
    '&:disabled': {
      color: COLORS['bg-300']
    },
    '.dark &:disabled': {
      color: COLORS['bg-700']
    }
  }
} as const

export const tertiaryDangerous = {
  color: COLORS['dangerous'],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colorWithOpacity('dangerous', '10%').toString()
    },
    '&:disabled': {
      color: colorWithOpacity('dangerous', '70%').toString()
    },
    '.dark &:disabled': {
      color: colorWithOpacity('dangerous', '70%').toString()
    }
  }
} as const
