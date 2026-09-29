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

const THEME_LIGHTNESS: Record<(typeof SHADES)[number], number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.76,
  400: 0.64,
  500: 0.55,
  600: 0.46,
  700: 0.38,
  800: 0.3,
  900: 0.22,
  950: 0.15
}

const THEME_CHROMA_WEIGHTS: Record<(typeof SHADES)[number], number> = {
  50: 0.2,
  100: 0.4,
  200: 0.65,
  300: 0.85,
  400: 0.95,
  500: 1.0,
  600: 0.95,
  700: 0.85,
  800: 0.75,
  900: 0.6,
  950: 0.45
}

const MAX_BG_CHROMA = 0.034

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme'
): Record<number, string> {
  const parsed = toOklch(color)
  const isBg = type === 'bg'
  const hue = parsed?.h ?? 0
  const inputChroma = parsed?.c ?? (isBg ? 0 : 0.15)
  const peakChroma = isBg ? Math.min(inputChroma, MAX_BG_CHROMA) : inputChroma

  const lightnessMap = isBg ? BG_LIGHTNESS : THEME_LIGHTNESS
  const chromaWeights = isBg ? BG_CHROMA_WEIGHTS : THEME_CHROMA_WEIGHTS

  return SHADES.reduce<Record<number, string>>((acc, shade) => {
    const l = lightnessMap[shade]
    const c = peakChroma * chromaWeights[shade]
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
