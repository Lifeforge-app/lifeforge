import * as d3 from 'd3'
import { useEffect } from 'react'

import { useControlKeyState } from '../../providers/ControlKeyStateProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'

export default function useZooming({ imageLoaded }: { imageLoaded: boolean }) {
  const isControlPressed = useControlKeyState()

  const { svgRef, gRef } = useSVGRefContext()

  const { isDrawing } = useDrawing()

  useEffect(() => {
    if (!svgRef.current || !gRef.current || !imageLoaded) return

    const svg = d3.select(svgRef.current)

    const g = d3.select(gRef.current)

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', event => {
        g.attr('transform', event.transform.toString())
      })

    // Apply or remove zoom behavior based on drawing state and Control key
    if (!isDrawing || isControlPressed) {
      svg.call(zoom)
    } else {
      svg.on('.zoom', null)
    }
  }, [isDrawing, isControlPressed, imageLoaded])
}
