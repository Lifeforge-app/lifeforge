import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useThemeEffect(
  rootElement: HTMLElement,
  theme: 'light' | 'dark',
  rawThemeColor: string,
  bgTemp: string
) {
  useEffect(() => {
    if (theme === 'dark') {
      rootElement.classList.add('dark')
    } else {
      rootElement.classList.remove('dark')
    }

    clearCustomColorProperties(rootElement, 'theme')
    clearCustomColorProperties(rootElement, 'bg')

    if (rawThemeColor.startsWith('#')) {
      interpolateColors(rootElement, theme, rawThemeColor, 'theme')
    }

    if (bgTemp.startsWith('#')) {
      interpolateColors(rootElement, theme, bgTemp, 'bg')
    }
  }, [theme])
}

export default useThemeEffect
