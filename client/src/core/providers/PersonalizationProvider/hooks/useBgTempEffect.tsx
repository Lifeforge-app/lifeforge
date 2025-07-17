import { useEffect } from 'react'

import {
  clearCustomColorProperties,
  interpolateColors
} from '../utils/themeColors'

function useBgTempEffect(bgTemp: string, theme: 'light' | 'dark') {
  useEffect(() => {
    if (bgTemp) {
      document.body.classList.remove(
        'bg-slate',
        'bg-gray',
        'bg-neutral',
        'bg-zinc',
        'bg-stone',
        'bg-custom'
      )
      document.body.classList.add(bgTemp.startsWith('#') ? 'bg-custom' : bgTemp)
    }

    clearCustomColorProperties('bg')

    if (bgTemp.startsWith('#')) {
      interpolateColors(theme, bgTemp, 'bg')
    }
  }, [bgTemp])
}

export default useBgTempEffect
