/* eslint-disable prefer-const */
import Gradient from 'javascript-color-gradient'

export function hexToRgb(hex: string): number[] {
  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)!
    .map(x => parseInt(x, 16))
}

export function rgbToHsl(r: number, g: number, b: number): number[] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    if (h !== undefined) h /= 6
  }

  return [h ?? 0, s, l]
}

export function hslToRgb(h: number, s: number, l: number): number[] {
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    function hue2rgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [r * 255, g * 255, b * 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = Math.floor(x).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

const multiplyMatrices = (A: number[], B: number[]) => {
  return [
    A[0] * B[0] + A[1] * B[1] + A[2] * B[2],
    A[3] * B[0] + A[4] * B[1] + A[5] * B[2],
    A[6] * B[0] + A[7] * B[1] + A[8] * B[2]
  ]
}

const oklch2oklab = ([l, c, h]: number[]) => [
  l,
  isNaN(h) ? 0 : c * Math.cos((h * Math.PI) / 180),
  isNaN(h) ? 0 : c * Math.sin((h * Math.PI) / 180)
]

const srgbLinear2rgb = (rgb: number[]) =>
  rgb.map(c =>
    Math.abs(c) > 0.0031308
      ? (c < 0 ? -1 : 1) * (1.055 * Math.abs(c) ** (1 / 2.4) - 0.055)
      : 12.92 * c
  )

const oklab2xyz = (lab: number[]) => {
  const LMSg = multiplyMatrices(
    [
      1, 0.3963377773761749, 0.2158037573099136, 1, -0.1055613458156586,
      -0.0638541728258133, 1, -0.0894841775298119, -1.2914855480194092
    ],
    lab
  )
  const LMS = LMSg.map(val => val ** 3)
  return multiplyMatrices(
    [
      1.2268798758459243, -0.5578149944602171, 0.2813910456659647,
      -0.0405757452148008, 1.112286803280317, -0.0717110580655164,
      -0.0763729366746601, -0.4214933324022432, 1.5869240198367816
    ],
    LMS
  )
}

const xyz2rgbLinear = (xyz: number[]) => {
  return multiplyMatrices(
    [
      3.2409699419045226, -1.537383177570094, -0.4986107602930034,
      -0.9692436362808796, 1.8759675015077202, 0.04155505740717559,
      0.05563007969699366, -0.20397695888897652, 1.0569715142428786
    ],
    xyz
  )
}

const oklch2rgb = (lch: number[]) =>
  srgbLinear2rgb(xyz2rgbLinear(oklab2xyz(oklch2oklab(lch))))

export function oklchToHex(oklch: string): string {
  const numbersInParentheses = oklch.match(/\(([^)]+)\)/)![1]
  let [l, c, h] = numbersInParentheses.split(' ').map(x => parseFloat(x))
  l /= 100
  const rgb = oklch2rgb([l, c, h]).map(x => Math.max(0, Math.min(1, x)))
  return rgbToHex(
    Math.round(rgb[0] * 255),
    Math.round(rgb[1] * 255),
    Math.round(rgb[2] * 255)
  )
}

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme',
  theme: 'dark' | 'light'
): Record<number, string> {
  let finalColor = color

  if (type === 'bg') {
    const [r, g, b] = hexToRgb(color)
    let [h, s, l] = rgbToHsl(r, g, b)
    l = theme === 'dark' ? 0.4 : 0.7
    const [r2, g2, b2] = hslToRgb(h, s, l)
    finalColor = rgbToHex(r2, g2, b2)
  }

  const gradientArray = new Gradient()
    .setColorGradient('#FFFFFF', finalColor, '#000000')
    .setMidpoint(14)
    .getColors()
    .slice(1, -1)

  const number = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  return number.reduce<Record<number, string>>((acc, cur, idx) => {
    acc[cur] = gradientArray[idx]
    return acc
  }, {})
}
