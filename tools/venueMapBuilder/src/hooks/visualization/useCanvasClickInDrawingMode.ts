import * as d3 from 'd3'
import { useEffect } from 'react'

import { useControlKeyState } from '../../providers/ControlKeyStateProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'

export default function useCanvasClickInDrawingMode() {
  const isControlPressed = useControlKeyState()

  const { svgRef, gRef } = useSVGRefContext()

  const { isDrawing, addPoint } = useDrawing()

  useEffect(() => {
    if (!svgRef.current || !isDrawing) return

    const handleClick = (event: MouseEvent) => {
      if (!gRef.current || isControlPressed) return

      const transform = d3.zoomTransform(gRef.current)

      const rect = (
        event.currentTarget as SVGSVGElement
      ).getBoundingClientRect()

      const x = (event.clientX - rect.left - transform.x) / transform.k

      const y = (event.clientY - rect.top - transform.y) / transform.k

      const newPoint: [number, number] = [Math.round(x), Math.round(y)]

      addPoint(newPoint, false)
    }

    svgRef.current.addEventListener('click', handleClick)

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [isDrawing, isControlPressed, addPoint])
}
