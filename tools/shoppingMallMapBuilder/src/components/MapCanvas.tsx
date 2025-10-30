import { useD3Visualization } from '../hooks/useD3Visualization'
import { useControlKeyState } from '../providers/ControlKeyStateProvider'
import { useDrawing } from '../providers/DrawingProvider'
import { useSVGRefContext } from '../providers/SVGRefProvider'
import { type HighlightedCoord } from '../types'

interface MapCanvasProps {
  highlightedCoord: HighlightedCoord | null
}

export function MapCanvas({ highlightedCoord }: MapCanvasProps) {
  const isControlPressed = useControlKeyState()

  const { isDrawing, newCoordinates } = useDrawing()

  const { svgRef, gRef } = useSVGRefContext()

  useD3Visualization({
    newCoordinates,
    highlightedCoord
  })

  return (
    <div className="component-bg mb-8 h-full overflow-hidden rounded-lg">
      <svg
        ref={svgRef}
        height="100%"
        style={{
          touchAction: 'none',
          cursor: isControlPressed
            ? 'grab'
            : isDrawing
              ? 'crosshair'
              : 'default'
        }}
        width="100%"
      >
        <g ref={gRef}></g>
      </svg>
    </div>
  )
}
