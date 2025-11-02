import { useEffect } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useSVGRefContext } from '../../providers/SVGRefProvider'

export default function useCanvasClickInNonDrawingMode() {
  const { svgRef } = useSVGRefContext()

  const {
    isDrawing,
    drawingMode,
    setSelectedElementId,
    isSettingEntrance,
    isConnectingNodes
  } = useDrawing()

  useEffect(() => {
    if (!svgRef.current || isDrawing) return

    const handleClick = () => {
      // If we're setting entrance location, don't handle background clicks
      // The unit polygon will handle the click instead
      if (isSettingEntrance && drawingMode === 'units') {
        return
      }

      // If we're in connecting mode, don't deselect on background click
      // User must exit through the sidebar
      if (isConnectingNodes) {
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
  }, [
    drawingMode,
    isDrawing,
    setSelectedElementId,
    isSettingEntrance,
    isConnectingNodes,
    svgRef
  ])
}
