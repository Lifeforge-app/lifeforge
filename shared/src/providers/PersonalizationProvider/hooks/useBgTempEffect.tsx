import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useBgTempEffect(
  rootElement: HTMLElement,
  bgTemp: string,
  theme: 'light' | 'dark'
) {
  useEffect(() => {
    if (bgTemp) {
      rootElement.classList.remove(
        'bg-slate',
        'bg-gray',
        'bg-neutral',
        'bg-zinc',
        'bg-stone',
        'bg-custom'
      )
      rootElement.classList.add(bgTemp.startsWith('#') ? 'bg-custom' : bgTemp)
    }

    clearCustomColorProperties(rootElement, 'bg')

    if (bgTemp.startsWith('#')) {
      interpolateColors(rootElement, theme, bgTemp, 'bg')
    }
  }, [bgTemp])
}

export default useBgTempEffect
