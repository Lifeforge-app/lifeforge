import Gradient from 'javascript-color-gradient'
import tinycolor from 'tinycolor2'

export function getColorPalette(
  color: string,
  type: 'bg' | 'theme',
  theme: 'dark' | 'light'
): Record<number, string> {
  let finalColor = color

  if (type === 'bg') {
    const colorInstance = tinycolor(color).toHsl()

    colorInstance.l = theme === 'dark' ? 0.4 : 0.7

    finalColor = tinycolor(colorInstance).toHexString()
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

export function interpolateColors(
  theme: 'light' | 'dark',
  color: string,
  type: 'bg' | 'theme'
) {
  const colorPalette = getColorPalette(color, type, theme)

  Object.entries(colorPalette).forEach(([key, value]) => {
    document.body.style.setProperty(
      `--color-${type === 'bg' ? 'bg' : 'custom'}-${key}`,
      tinycolor(value).toRgbString()
    )
  })
}

export function clearCustomColorProperties(type: 'bg' | 'theme') {
  const number = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  for (let i = 0; i < number.length; i++) {
    document.body.style.removeProperty(
      `--color-${type === 'bg' ? 'bg' : 'custom'}-${number[i]}`
    )
  }
}
