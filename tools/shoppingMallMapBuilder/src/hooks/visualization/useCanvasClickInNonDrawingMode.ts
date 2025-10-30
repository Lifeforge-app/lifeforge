import { useEffect } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'
import type { DrawingMode } from '../../types'

const TARGET_TAG_NAMES: Record<DrawingMode, string> = {
  units: 'polygon',
  outline: 'line',
  'outline-circle': 'outline-circle'
}

export default function useCanvasClickInNonDrawingMode() {
  const { svgRef } = useSVGRefContext()

  const { isDrawing, drawingMode, setSelectedElementId, selectedElementId } =
    useDrawing()

  useEffect(() => {
    if (!svgRef.current || isDrawing) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element

      if (
        selectedElementId &&
        target.tagName !== TARGET_TAG_NAMES[drawingMode]
      ) {
        setSelectedElementId(null)
      }
    }

    svgRef.current.addEventListener('click', handleClick)

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [drawingMode, isDrawing, selectedElementId, setSelectedElementId])
}
