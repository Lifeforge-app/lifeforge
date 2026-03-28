// Colors are kept as a plain object (NOT inside createGlobalTheme) so that
// vanilla-extract does not generate intermediate hash variables for them.
// Sprinkles built from this object will emit e.g. `color: var(--color-bg-500)`
// directly, which resolves lazily at the element scope and correctly inherits
// the value set by the theme body class (e.g. `.bg-zinc`).

/**
 * Flat color map for use as a vanilla-extract sprinkles property value set.
 * Includes bg-* and custom-* palette entries.
 */
export const colors = {
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
} as const

// ── Grouped token objects for use in vanilla-extract style() calls ────────────
//
// Use these instead of raw var() strings in .css.ts files:
//   backgroundColor: bg[500]          ← resolves to 'var(--color-bg-500)'
//   backgroundColor: custom[500]      ← resolves to 'var(--color-custom-500)'

/**
 * Bg-palette token map, keyed by numeric shade (50–950).
 * Index with `bg[500]` inside `style()` calls.
 */
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

/**
 * Custom (accent) palette token map, keyed by numeric shade (50–900).
 * Index with `custom[500]` inside `style()` calls.
 */
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

// ── Types ─────────────────────────────────────────────────────────────────────

export type ColorToken = keyof typeof colors

export type BgColorSlot = keyof typeof bg

export type CustomColorSlot = keyof typeof custom

// ── Utilities ─────────────────────────────────────────────────────────────────

/**
 * Mixes a colour with transparency using `color-mix`.
 *
 * @param color  Any CSS color value (e.g. `bg[500]`, `'#hexValue'`, `'rgb(…)'`)
 * @param alpha  Opacity factor in [0, 1]
 * @returns      `color-mix(in srgb, <color> <alpha%>, transparent)`
 *
 * @example
 * borderColor: withOpacity(bg[500], 0.2)  // 20% opaque bg-500
 */
export function withOpacity(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha))

  return `color-mix(in srgb, ${color} ${a * 100}%, transparent)`
}
