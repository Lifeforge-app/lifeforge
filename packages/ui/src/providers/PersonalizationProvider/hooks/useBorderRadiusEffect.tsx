import { useEffect } from 'react'

function useBorderRadiusEffect(borderRadiusMultiplier: number) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--custom-border-radius-multiplier',
      `${borderRadiusMultiplier}`
    )
  }, [borderRadiusMultiplier])
}

export default useBorderRadiusEffect
