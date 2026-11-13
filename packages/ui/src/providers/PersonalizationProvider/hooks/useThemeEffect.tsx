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
    const isDark = theme === 'dark'
    const bgColor = isDark ? '#09090b' : '#ffffff'

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark)
      document.documentElement.style.backgroundColor = bgColor
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    }

    // The point of this hook is to style the root element handed in by the
    // provider. React Compiler flags that mutation as a purity violation, but
    // it is the intended effect, not derived state.
    /* eslint-disable react-compiler/react-compiler */
    rootElement.classList.toggle('dark', isDark)
    rootElement.style.backgroundColor = bgColor

    clearCustomColorProperties(rootElement, 'theme')
    clearCustomColorProperties(rootElement, 'bg')

    if (rawThemeColor.startsWith('#')) {
      interpolateColors(rootElement, rawThemeColor, 'theme')
    }

    if (bgTemp.startsWith('#')) {
      interpolateColors(rootElement, bgTemp, 'bg')
    }
  }, [theme])
}

export default useThemeEffect
