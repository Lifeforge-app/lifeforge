import { colorWithOpacity } from './color-with-opacity'

export const surface = {
  light: {
    base: 'bg-100' as const,
    dark: 'bg-800' as const
  },
  lightInteractive: {
    base: 'bg-100' as const,
    dark: 'bg-800' as const,
    hover: colorWithOpacity('bg-200', '70%'),
    darkHover: colorWithOpacity('bg-700', '50%')
  },
  default: {
    base: 'bg-50' as const,
    dark: 'bg-900' as const
  },
  defaultInteractive: {
    base: 'bg-50' as const,
    dark: 'bg-900' as const,
    hover: 'bg-100' as const,
    darkHover: 'bg-800' as const
  }
} as const
