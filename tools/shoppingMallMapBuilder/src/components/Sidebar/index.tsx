import { SidebarWrapper } from 'lifeforge-ui'

import OutlineMode from '../../modes/outline/OutlineMode'
import type { useOutline } from '../../modes/outline/useOutline'
import OutlineCircleMode from '../../modes/outlineCircle/OutlineCircleMode'
import type { useOutlineCircle } from '../../modes/outlineCircle/useOutlineCircle'
import UnitMode from '../../modes/unit/UnitMode'
import type { useUnit } from '../../modes/unit/useUnit'
import { useDrawing } from '../../providers/DrawingProvider'
import type { HighlightedCoord } from '../../types'
import SidebarDrawTypeSelector from './components/SidebarDrawTypeSelector'
import SidebarHeader from './components/SidebarHeader'

interface SidebarProps {
  unitState: ReturnType<typeof useUnit>
  outlineState: ReturnType<typeof useOutline>
  circleState: ReturnType<typeof useOutlineCircle>
  onAlignCoordinates: () => void
  onStartDrawing: () => void
  onFinishDrawing: () => void
  onHighlightCoord: (coord: HighlightedCoord | null) => void
  onPerformUnitOCR: () => Promise<void>
}

export function Sidebar({
  unitState,
  outlineState,
  circleState,
  onAlignCoordinates,
  onStartDrawing,
  onFinishDrawing,
  onHighlightCoord,
  onPerformUnitOCR
}: SidebarProps) {
  const { drawingMode } = useDrawing()

  return (
    <SidebarWrapper>
      <div className="px-4">
        <SidebarHeader />
        <SidebarDrawTypeSelector />
        {drawingMode === 'units' && (
          <UnitMode
            unitState={unitState}
            onAlignCoordinates={onAlignCoordinates}
            onFinishDrawing={onFinishDrawing}
            onHighlightCoord={() => onHighlightCoord(null)}
            onPerformUnitOCR={onPerformUnitOCR}
            onStartDrawing={onStartDrawing}
          />
        )}
        {drawingMode === 'outline' && (
          <OutlineMode
            outlineState={outlineState}
            onFinishDrawing={onFinishDrawing}
            onStartDrawing={onStartDrawing}
          />
        )}
        {drawingMode === 'outline-circle' && (
          <OutlineCircleMode
            circleState={circleState}
            onStartDrawing={onStartDrawing}
          />
        )}
      </div>
    </SidebarWrapper>
  )
}
