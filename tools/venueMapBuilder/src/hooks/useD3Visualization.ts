import { useState } from 'react'

import { useControlKeyState } from '../providers/ControlKeyStateProvider'
import { useSVGRefContext } from '../providers/SVGRefProvider'
import { type HighlightedCoord } from '../types'
import { type CoordinateWithSnapInfo } from '../types'
import useCanvasClickInDrawingMode from './visualization/useCanvasClickInDrawingMode'
import useCanvasClickInNonDrawingMode from './visualization/useCanvasClickInNonDrawingMode'
import useImageVisibility from './visualization/useImageVisibility'
import useInitialSetup from './visualization/useInitialization'
import useRenderCanvasContent from './visualization/useRenderCanvasContent'
import useZooming from './visualization/useZooming'

interface UseD3VisualizationProps {
  newCoordinates: CoordinateWithSnapInfo[]
  highlightedCoord: HighlightedCoord | null
  onPathNodeClick?: (nodeId: string) => void
}

export function useD3Visualization({
  newCoordinates,
  highlightedCoord,
  onPathNodeClick
}: UseD3VisualizationProps) {
  const isControlPressed = useControlKeyState()

  const { svgRef, gRef } = useSVGRefContext()

  const [imageLoaded, setImageLoaded] = useState(false)

  useInitialSetup({
    setImageLoaded
  })

  useImageVisibility()

  useZooming({
    imageLoaded
  })

  useRenderCanvasContent({
    newCoordinates,
    highlightedCoord,
    imageLoaded,
    onPathNodeClick
  })

  useCanvasClickInDrawingMode()

  useCanvasClickInNonDrawingMode()

  return {
    svgRef,
    gRef,
    imageLoaded,
    isControlPressed
  }
}
