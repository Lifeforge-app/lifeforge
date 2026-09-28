import { clampRgb, converter, formatHex, type Oklch } from 'culori'

const toOklch = converter('oklch')
const toRgb = converter('rgb')

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const BG_LIGHTNESS: Record<(typeof SHADES)[number], number> = {
  50: 0.985,
  100: 0.960,
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
  200: 0.20,
  300: 0.38,
  400: 0.60,
  500: 1.00,
  600: 0.85,
  700: 0.75,
  800: 0.60,
  900: 0.40,
  950: 0.20
}

const THEME_LIGHTNESS: Record<(typeof SHADES)[number], number> = {
  50: 0.970,
  100: 0.930,
  200: 0.860,
  300: 0.760,
  400: 0.640,
  500: 0.550,
  600: 0.460,
  700: 0.380,
  800: 0.300,
  900: 0.220,
  950: 0.150
}

const THEME_CHROMA_WEIGHTS: Record<(typeof SHADES)[number], number> = {
  50: 0.20,
  100: 0.40,
  200: 0.65,
  300: 0.85,
  400: 0.95,
  500: 1.00,
  600: 0.95,
  700: 0.85,
  800: 0.75,
  900: 0.60,
  950: 0.45
}

const MAX_BG_CHROMA = 0.034

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme',
  theme: 'dark' | 'light'
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
  theme: 'light' | 'dark',
  color: string,
  type: 'bg' | 'theme'
) {
  const colorPalette = getColorPalette(color, type, theme)

  Object.entries(colorPalette).forEach(([key, value]) => {
    const prefix = type === 'bg' ? 'bg' : 'custom'
    const rgb = clampRgb(toRgb(value))
    if (!rgb) return

    const r = Math.round((rgb.r ?? 0) * 255)
    const g = Math.round((rgb.g ?? 0) * 255)
    const b = Math.round((rgb.b ?? 0) * 255)

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
