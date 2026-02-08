export const bg = {
  50: 'var(--color-bg-50)',
  100: 'var(--color-bg-100)',
  200: 'var(--color-bg-200)',
  300: 'var(--color-bg-300)',
  400: 'var(--color-bg-400)',
  500: 'var(--color-bg-500)',
  600: 'var(--color-bg-600)',
  700: 'var(--color-bg-700)',
  800: 'var(--color-bg-800)',
  900: 'var(--color-bg-900)',
  950: 'var(--color-bg-950)'
} as const

export const custom = {
  50: 'var(--color-custom-50)',
  100: 'var(--color-custom-100)',
  200: 'var(--color-custom-200)',
  300: 'var(--color-custom-300)',
  400: 'var(--color-custom-400)',
  500: 'var(--color-custom-500)',
  600: 'var(--color-custom-600)',
  700: 'var(--color-custom-700)',
  800: 'var(--color-custom-800)',
  900: 'var(--color-custom-900)'
} as const

export type BgColorSlot = keyof typeof bg

export type CustomColorSlot = keyof typeof custom
