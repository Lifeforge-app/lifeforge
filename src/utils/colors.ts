/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Gradient from 'javascript-color-gradient'

export function isLightColor(color: string): boolean {
  let r = 0
  let g = 0
  let b = 0
  if (color.startsWith('#')) {
    r = parseInt(color.substr(1, 2), 16)
    g = parseInt(color.substr(3, 2), 16)
    b = parseInt(color.substr(5, 2), 16)
  }
  if (color.startsWith('rgb')) {
    const match = color.match(/(\d+)/g)
    r = parseInt(match![0])
    g = parseInt(match![1])
    b = parseInt(match![2])
  }
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}

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

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme',
  theme: 'dark' | 'light'
): Record<number, string> {
  let finalColor = color

  if (type === 'bg') {
    const [r, g, b] = hexToRgb(color)
    let [h, s, l] = rgbToHsl(r, g, b)
    l = theme === 'dark' ? 0.5 : 0.7
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
