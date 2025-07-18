import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useRawThemeColorEffect(
  rawThemeColor: string,
  theme: 'light' | 'dark'
) {
  useEffect(() => {
    if (rawThemeColor) {
      document.body.classList.remove(
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

      clearCustomColorProperties('theme')

      document.body.classList.add(
        rawThemeColor.startsWith('#') ? 'theme-custom' : rawThemeColor
      )

      if (rawThemeColor.startsWith('#')) {
        interpolateColors(theme, rawThemeColor, 'theme')
      }
    }
  }, [rawThemeColor])
}

export default useRawThemeColorEffect
