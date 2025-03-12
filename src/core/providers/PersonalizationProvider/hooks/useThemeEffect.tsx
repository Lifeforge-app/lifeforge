import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useThemeEffect(
  theme: 'light' | 'dark' | 'system',
  rawThemeColor: string,
  bgTemp: string
) {
  useEffect(() => {
    if (
      (theme === 'system' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      theme === 'dark'
    ) {
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
