import { colorWithOpacity } from './color-with-opacity'

export const surface = {
  light: {
    base: 'bg-100',
    dark: colorWithOpacity('bg-800', '70%')
  },
  lightInteractive: {
    base: 'bg-100',
    dark: colorWithOpacity('bg-800', '70%'),
    hover: colorWithOpacity('bg-200', '70%'),
    darkHover: colorWithOpacity('bg-700', '50%')
  },
  default: {
    base: 'bg-50',
    dark: 'bg-900'
  },
  defaultInteractive: {
    base: 'bg-50',
    dark: 'bg-900',
    hover: colorWithOpacity('bg-50', '70%'),
    darkHover: 'bg-800'
  }
} as const
