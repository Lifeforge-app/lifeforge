import { useEffect } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'

export default function useCanvasClickInNonDrawingMode() {
  const { svgRef } = useSVGRefContext()

  const { isDrawing, drawingMode, setSelectedElementId, isSettingEntrance } =
    useDrawing()

  useEffect(() => {
    if (!svgRef.current || isDrawing) return

    const handleClick = () => {
      // If we're setting entrance location, don't handle background clicks
      // The unit polygon will handle the click instead
      if (isSettingEntrance && drawingMode === 'units') {
        return
      }

      // Default behavior: deselect on background click
      setSelectedElementId(null)
    }

    svgRef.current.addEventListener('click', handleClick)

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener('click', handleClick)
      }
    }
  }, [drawingMode, isDrawing, setSelectedElementId, isSettingEntrance, svgRef])
}
