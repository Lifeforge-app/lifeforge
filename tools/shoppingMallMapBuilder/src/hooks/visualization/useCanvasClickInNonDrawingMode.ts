import { useEffect } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'

export default function useCanvasClickInNonDrawingMode() {
  const { svgRef } = useSVGRefContext()

  const { isDrawing, drawingMode, setSelectedElementId, selectedElementId } =
    useDrawing()

  useEffect(() => {
    if (!svgRef.current || isDrawing) return

    const handleClick = () => {
      setSelectedElementId(null)
    }

    svgRef.current.addEventListener('click', handleClick)

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [drawingMode, isDrawing, selectedElementId, setSelectedElementId])
}
