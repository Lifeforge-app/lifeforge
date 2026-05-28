/**
 * Flat color map for use as a vanilla-extract sprinkles property value set.
 * Includes bg-* and custom-* palette entries.
 */
export const COLORS = {
  transparent: 'transparent',
  'bg-50': 'var(--color-bg-50)',
  'bg-100': 'var(--color-bg-100)',
  'bg-200': 'var(--color-bg-200)',
  'bg-300': 'var(--color-bg-300)',
  'bg-400': 'var(--color-bg-400)',
  'bg-500': 'var(--color-bg-500)',
  'bg-600': 'var(--color-bg-600)',
  'bg-700': 'var(--color-bg-700)',
  'bg-800': 'var(--color-bg-800)',
  'bg-900': 'var(--color-bg-900)',
  'bg-950': 'var(--color-bg-950)',
  'custom-50': 'var(--color-custom-50)',
  'custom-100': 'var(--color-custom-100)',
  'custom-200': 'var(--color-custom-200)',
  'custom-300': 'var(--color-custom-300)',
  'custom-400': 'var(--color-custom-400)',
  'custom-500': 'var(--color-custom-500)',
  'custom-600': 'var(--color-custom-600)',
  'custom-700': 'var(--color-custom-700)',
  'custom-800': 'var(--color-custom-800)',
  'custom-900': 'var(--color-custom-900)',
  dangerous: 'var(--color-dangerous)'
} as const

export type ColorToken = keyof typeof COLORS
