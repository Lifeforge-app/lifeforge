import * as d3 from 'd3'
import { useEffect } from 'react'

import { useSVGRefContext } from '../../providers/SVGRefProvider'
import { useSettings } from '../../providers/SettingsProvider'

export default function useImageVisibility() {
  const { gRef } = useSVGRefContext()

  const { showFloorPlanImage } = useSettings()

  useEffect(() => {
    if (!gRef.current) return

    const g = d3.select(gRef.current)

    const imageLayer = g.select('.image-layer')

    if (imageLayer.empty()) return

    imageLayer.style('opacity', showFloorPlanImage ? 1 : 0)
  }, [showFloorPlanImage])
}
