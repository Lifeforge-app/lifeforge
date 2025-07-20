import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useThemeEffect(
  theme: 'light' | 'dark',
  rawThemeColor: string,
  bgTemp: string
) {
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    clearCustomColorProperties('theme')
    clearCustomColorProperties('bg')

    if (rawThemeColor.startsWith('#')) {
      interpolateColors(theme, rawThemeColor, 'theme')
    }

    if (bgTemp.startsWith('#')) {
      interpolateColors(theme, bgTemp, 'bg')
    }
  }, [theme])
}

export default useThemeEffect
