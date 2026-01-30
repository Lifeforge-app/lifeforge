import { createGlobalTheme } from '@vanilla-extract/css'

export const vars = createGlobalTheme(':root', {
  space: {
    none: '0',
    xs: 'calc(var(--spacing) * 1)',
    sm: 'calc(var(--spacing) * 2)',
    md: 'calc(var(--spacing) * 4)',
    lg: 'calc(var(--spacing) * 6)',
    xl: 'calc(var(--spacing) * 8)',
    '2xl': 'calc(var(--spacing) * 12)',
    '3xl': 'calc(var(--spacing) * 16)'
  },
  radii: {
    none: '0',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: '9999px'
  },
  colors: {
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
    'custom-900': 'var(--color-custom-900)'
  },
  fontSize: {
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
    '5xl': 'var(--text-5xl)',
    '6xl': 'var(--text-6xl)',
    '7xl': 'var(--text-7xl)',
    '8xl': 'var(--text-8xl)',
    '9xl': 'var(--text-9xl)'
  },
  lineHeight: {
    sm: 'var(--text-sm--line-height)',
    base: 'var(--text-base--line-height)',
    lg: 'var(--text-lg--line-height)',
    xl: 'var(--text-xl--line-height)',
    '2xl': 'var(--text-2xl--line-height)',
    '3xl': 'var(--text-3xl--line-height)',
    '4xl': 'var(--text-4xl--line-height)',
    '5xl': 'var(--text-5xl--line-height)',
    '6xl': 'var(--text-6xl--line-height)',
    '7xl': 'var(--text-7xl--line-height)',
    '8xl': 'var(--text-8xl--line-height)',
    '9xl': 'var(--text-9xl--line-height)'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
})

export type SpaceToken = keyof typeof vars.space

export type RadiusToken = keyof typeof vars.radii

export type ColorToken = keyof typeof vars.colors

export type FontSizeToken = keyof typeof vars.fontSize

export type FontWeightToken = keyof typeof vars.fontWeight
