import { COLORS, colorWithOpacity } from '@/system'

export const plain = {
  backgroundColor: 'transparent',
  color: COLORS['bg-500'],
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colorWithOpacity('bg-200', '50%').toString(),
      color: COLORS['bg-800']
    },
    '.dark &:hover:not(:disabled)': {
      backgroundColor: colorWithOpacity('bg-800', '50%').toString(),
      color: COLORS['bg-50']
    },
    '&:disabled': {
      color: COLORS['bg-300']
    },
    '.dark &:disabled': {
      color: COLORS['bg-700']
    }
  }
} as const

export const plainDangerous = {
  color: COLORS['dangerous'],
  selectors: {
    '&:hover:not(:disabled)': {
      color: COLORS['dangerous'],
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
