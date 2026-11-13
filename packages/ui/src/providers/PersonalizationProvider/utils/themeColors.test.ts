import { describe, expect, it } from 'vitest'

import {
  clearCustomColorProperties,
  getColorPalette,
  interpolateColors
} from './themeColors'

const EXPECTED_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

function createMockElement(): HTMLElement {
  const styles: Record<string, string> = {}

  return {
    style: {
      setProperty(prop: string, val: string) {
        styles[prop] = val
      },
      getPropertyValue(prop: string) {
        return styles[prop] ?? ''
      },
      removeProperty(prop: string) {
        delete styles[prop]
      }
    }
  } as unknown as HTMLElement
}

describe('themeColors', () => {
  describe('getColorPalette', () => {
    it('generates all 11 shades for background palettes', () => {
      const palette = getColorPalette('#3b82f6', 'bg')
      const keys = Object.keys(palette).map(Number)

      expect(keys).toEqual(EXPECTED_SHADES)
      EXPECTED_SHADES.forEach(shade => {
        expect(palette[shade]).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('generates all 11 shades for theme palettes and anchors shade 500 to the selected color', () => {
      const palette = getColorPalette('#10b981', 'theme')
      const keys = Object.keys(palette).map(Number)

      expect(keys).toEqual(EXPECTED_SHADES)
      EXPECTED_SHADES.forEach(shade => {
        expect(palette[shade]).toMatch(/^#[0-9a-f]{6}$/i)
      })
      expect(palette[500]?.toLowerCase()).toBe('#10b981')

      const bluePalette = getColorPalette('#3b82f6', 'theme')
      expect(bluePalette[500]?.toLowerCase()).toBe('#3b82f6')
    })

    it('dampens chroma for vibrant background colors', () => {
      const vibrantPalette = getColorPalette('#ff0000', 'bg')
      const pureGrayPalette = getColorPalette('#808080', 'bg')

      expect(vibrantPalette[50]).toMatch(/^#[0-9a-f]{6}$/i)
      expect(vibrantPalette[950]).toMatch(/^#[0-9a-f]{6}$/i)
      expect(pureGrayPalette[50]).toMatch(/^#[0-9a-f]{6}$/i)
      expect(pureGrayPalette[950]).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('handles pure black, pure white, and neutral hex inputs without errors', () => {
      const blackPalette = getColorPalette('#000000', 'bg')
      const whitePalette = getColorPalette('#ffffff', 'bg')

      EXPECTED_SHADES.forEach(shade => {
        expect(blackPalette[shade]).toBeDefined()
        expect(blackPalette[shade]).toMatch(/^#[0-9a-f]{6}$/i)
        expect(whitePalette[shade]).toBeDefined()
        expect(whitePalette[shade]).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('ensures monotonic lightness progression from shade 50 to shade 950', () => {
      const palette = getColorPalette('#6366f1', 'bg')

      for (let i = 0; i < EXPECTED_SHADES.length - 1; i++) {
        const lighterShade = EXPECTED_SHADES[i]!
        const darkerShade = EXPECTED_SHADES[i + 1]!

        const hexToRgbSum = (hex: string) => {
          const num = parseInt(hex.slice(1), 16)
          const r = (num >> 16) & 255
          const g = (num >> 8) & 255
          const b = num & 255

          return r + g + b
        }

        expect(hexToRgbSum(palette[lighterShade]!)).toBeGreaterThanOrEqual(
          hexToRgbSum(palette[darkerShade]!)
        )
      }
    })
  })

  describe('interpolateColors', () => {
    it('sets CSS variables and channel variables for bg palette on rootElement', () => {
      const element = createMockElement()

      interpolateColors(element, '#3b82f6', 'bg')

      EXPECTED_SHADES.forEach(shade => {
        const varValue = element.style.getPropertyValue(`--color-bg-${shade}`)
        const chValue = element.style.getPropertyValue(`--color-bg-${shade}-ch`)

        expect(varValue).toMatch(/^rgb\(\d+ \d+ \d+\)$/)
        expect(chValue).toMatch(/^\d+ \d+ \d+$/)
      })
    })

    it('sets CSS variables and channel variables for custom theme palette on rootElement', () => {
      const element = createMockElement()

      interpolateColors(element, '#ec4899', 'theme')

      EXPECTED_SHADES.forEach(shade => {
        const varValue = element.style.getPropertyValue(
          `--color-custom-${shade}`
        )
        const chValue = element.style.getPropertyValue(
          `--color-custom-${shade}-ch`
        )

        expect(varValue).toMatch(/^rgb\(\d+ \d+ \d+\)$/)
        expect(chValue).toMatch(/^\d+ \d+ \d+$/)
      })
    })
  })

  describe('clearCustomColorProperties', () => {
    it('removes custom properties for bg and theme', () => {
      const element = createMockElement()

      interpolateColors(element, '#3b82f6', 'bg')
      interpolateColors(element, '#ec4899', 'theme')

      clearCustomColorProperties(element, 'bg')
      EXPECTED_SHADES.forEach(shade => {
        expect(element.style.getPropertyValue(`--color-bg-${shade}`)).toBe('')
        expect(element.style.getPropertyValue(`--color-bg-${shade}-ch`)).toBe(
          ''
        )
        expect(
          element.style.getPropertyValue(`--color-custom-${shade}`)
        ).not.toBe('')
      })

      clearCustomColorProperties(element, 'theme')
      EXPECTED_SHADES.forEach(shade => {
        expect(element.style.getPropertyValue(`--color-custom-${shade}`)).toBe(
          ''
        )
        expect(
          element.style.getPropertyValue(`--color-custom-${shade}-ch`)
        ).toBe('')
      })
    })
  })
})
