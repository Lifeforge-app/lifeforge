import { createGlobalTheme } from '@vanilla-extract/css'

/**
 * Design system CSS variable contract.
 * These reference the CSS custom properties defined in src/styles/themes/index.css
 * and auto-scale with user personalisation settings (font scale, border radius multiplier).
 *
 * Use `vars.*` inside vanilla-extract style() calls to reference design tokens
 * without hardcoding CSS variable names.
 */
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

export type FontSizeToken = keyof typeof vars.fontSize

export type FontWeightToken = keyof typeof vars.fontWeight
