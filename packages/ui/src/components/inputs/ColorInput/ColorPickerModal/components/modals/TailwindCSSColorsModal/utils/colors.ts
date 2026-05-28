/* eslint-disable prefer-const */
import { converter, formatHex, parseHex } from 'culori'
import 'culori/css'
import Gradient from 'javascript-color-gradient'

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme',
  theme: 'dark' | 'light'
): Record<number, string> {
  let finalColor = color

  if (type === 'bg') {
    const parsed = converter('hsl')(parseHex(color))

    if (!parsed) return {}

    let { h, s, l } = parsed

    l = theme === 'dark' ? 0.4 : 0.7

    finalColor = formatHex(converter('rgb')({ mode: 'hsl', h, s, l }))
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
