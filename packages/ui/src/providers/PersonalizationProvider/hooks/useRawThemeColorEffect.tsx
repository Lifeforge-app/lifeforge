import { useEffect } from 'react'
import tinycolor from 'tinycolor2'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useRawThemeColorEffect(
  rootElement: HTMLElement,
  rawThemeColor: string,
  theme: 'light' | 'dark',
  bgTemp: [light: string, dark: string]
) {
  useEffect(() => {
    if (rawThemeColor) {
      rootElement.classList.remove(
        ...[
          'theme-red',
          'theme-pink',
          'theme-purple',
          'theme-deep-purple',
          'theme-indigo',
          'theme-blue',
          'theme-light-blue',
          'theme-cyan',
          'theme-teal',
          'theme-green',
          'theme-light-green',
          'theme-lime',
          'theme-yellow',
          'theme-amber',
          'theme-orange',
          'theme-deep-orange',
          'theme-brown',
          'theme-grey',
          'theme-custom'
        ]
      )

      clearCustomColorProperties(rootElement, 'theme')

      rootElement.classList.add(
        rawThemeColor.startsWith('#') ? 'theme-custom' : rawThemeColor
      )

      rootElement.style.setProperty(
        '--lf-selection-bg',
        tinycolor.mostReadable(rawThemeColor, bgTemp).toHexString()
      )

      if (rawThemeColor.startsWith('#')) {
        interpolateColors(rootElement, theme, rawThemeColor, 'theme')
      }
    }
  }, [rawThemeColor])
}

export default useRawThemeColorEffect
