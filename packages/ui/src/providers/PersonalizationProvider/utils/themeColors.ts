import { type Oklch, clampRgb, converter, formatHex } from 'culori'

const toOklch = converter('oklch')
const toRgb = converter('rgb')

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const BG_LIGHTNESS: Record<(typeof SHADES)[number], number> = {
  50: 0.985,
  100: 0.96,
  200: 0.922,
  300: 0.865,
  400: 0.711,
  500: 0.542,
  600: 0.435,
  700: 0.364,
  800: 0.263,
  900: 0.212,
  950: 0.145
}

const BG_CHROMA_WEIGHTS: Record<(typeof SHADES)[number], number> = {
  50: 0.08,
  100: 0.12,
  200: 0.2,
  300: 0.38,
  400: 0.6,
  500: 1.0,
  600: 0.85,
  700: 0.75,
  800: 0.6,
  900: 0.4,
  950: 0.2
}

const MAX_BG_CHROMA = 0.034
const TARGET_WHITE_L = 0.985
const TARGET_DARK_L = 0.14

const TINT_WEIGHTS: Record<50 | 100 | 200 | 300 | 400, number> = {
  50: 0.08,
  100: 0.18,
  200: 0.38,
  300: 0.6,
  400: 0.82
}

const SHADE_WEIGHTS: Record<600 | 700 | 800 | 900 | 950, number> = {
  600: 0.22,
  700: 0.44,
  800: 0.66,
  900: 0.84,
  950: 0.96
}

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme'
): Record<number, string> {
  const parsed = toOklch(color)
  const isBg = type === 'bg'
  const hue = parsed?.h ?? 0

  if (isBg) {
    const inputChroma = parsed?.c ?? 0
    const peakChroma = Math.min(inputChroma, MAX_BG_CHROMA)

    return SHADES.reduce<Record<number, string>>((acc, shade) => {
      const l = BG_LIGHTNESS[shade]
      const c = peakChroma * BG_CHROMA_WEIGHTS[shade]
      const oklchColor: Oklch = { mode: 'oklch', l, c, h: hue }
      const rgb = clampRgb(toRgb(oklchColor))
      acc[shade] = formatHex(rgb)

      return acc
    }, {})
  }

  const l0 = parsed?.l ?? 0.55
  const c0 = parsed?.c ?? 0.15
  const whiteL = Math.max(TARGET_WHITE_L, l0 + 0.02)
  const whiteC = Math.min(0.01, c0 * 0.1)
  const darkL = Math.min(TARGET_DARK_L, Math.max(0.05, l0 - 0.02))
  const darkC = c0 * 0.35

  return SHADES.reduce<Record<number, string>>((acc, shade) => {
    let l = l0
    let c = c0

    if (shade in TINT_WEIGHTS) {
      const w = TINT_WEIGHTS[shade as keyof typeof TINT_WEIGHTS]
      l = whiteL + (l0 - whiteL) * w
      c = whiteC + (c0 - whiteC) * w
    } else if (shade in SHADE_WEIGHTS) {
      const w = SHADE_WEIGHTS[shade as keyof typeof SHADE_WEIGHTS]
      l = l0 + (darkL - l0) * w
      c = c0 + (darkC - c0) * w
    }

    const oklchColor: Oklch = { mode: 'oklch', l, c, h: hue }
    const rgb = clampRgb(toRgb(oklchColor))
    acc[shade] = formatHex(rgb)

    return acc
  }, {})
}

export function interpolateColors(
  rootElement: HTMLElement,
  color: string,
  type: 'bg' | 'theme'
) {
  const colorPalette = getColorPalette(color, type)

  Object.entries(colorPalette).forEach(([key, value]) => {
    const prefix = type === 'bg' ? 'bg' : 'custom'
    const rgb = toRgb(value)

    if (!rgb) return

    const clamped = clampRgb(rgb)

    const r = Math.round((clamped.r ?? 0) * 255)
    const g = Math.round((clamped.g ?? 0) * 255)
    const b = Math.round((clamped.b ?? 0) * 255)

    rootElement.style.setProperty(
      `--color-${prefix}-${key}`,
      `rgb(${r} ${g} ${b})`
    )
    rootElement.style.setProperty(
      `--color-${prefix}-${key}-ch`,
      `${r} ${g} ${b}`
    )
  })
}

export function clearCustomColorProperties(
  rootElement: HTMLElement,
  type: 'bg' | 'theme'
) {
  const prefix = type === 'bg' ? 'bg' : 'custom'

  for (let i = 0; i < SHADES.length; i++) {
    rootElement.style.removeProperty(`--color-${prefix}-${SHADES[i]}`)
    rootElement.style.removeProperty(`--color-${prefix}-${SHADES[i]}-ch`)
  }
}
