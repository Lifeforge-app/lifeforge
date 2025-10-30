import { SidebarWrapper } from 'lifeforge-ui'
import { useState } from 'react'

import AmenityMode from '../../modes/amenities/AmenityMode'
import type { useAmenity } from '../../modes/amenities/useAmenity'
import OutlineMode from '../../modes/outline/OutlineMode'
import type { useOutline } from '../../modes/outline/useOutline'
import OutlineCircleMode from '../../modes/outlineCircle/OutlineCircleMode'
import type { useOutlineCircle } from '../../modes/outlineCircle/useOutlineCircle'
import UnitMode from '../../modes/unit/UnitMode'
import type { useUnit } from '../../modes/unit/useUnit'
import UnitDataMode from '../../modes/unitData/UnitDataMode'
import { useDrawing } from '../../providers/DrawingProvider'
import type { HighlightedCoord } from '../../types'
import SidebarDrawTypeSelector from './components/SidebarDrawTypeSelector'
import SidebarHeader from './components/SidebarHeader'

interface SidebarProps {
  unitState: ReturnType<typeof useUnit>
  outlineState: ReturnType<typeof useOutline>
  circleState: ReturnType<typeof useOutlineCircle>
  amenityState: ReturnType<typeof useAmenity>
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
  amenityState,
  onAlignCoordinates,
  onStartDrawing,
  onFinishDrawing,
  onHighlightCoord,
  onPerformUnitOCR
}: SidebarProps) {
  const { drawingMode } = useDrawing()

  const [unitTab, setUnitTab] = useState<'polygons' | 'data'>('polygons')

  return (
    <SidebarWrapper>
      <div className="flex flex-col overflow-y-hidden px-4">
        <SidebarHeader />
        <SidebarDrawTypeSelector setUnitTab={setUnitTab} unitTab={unitTab} />
        {drawingMode === 'units' &&
          (unitTab === 'polygons' ? (
            <UnitMode
              unitState={unitState}
              onAlignCoordinates={onAlignCoordinates}
              onFinishDrawing={onFinishDrawing}
              onHighlightCoord={onHighlightCoord}
              onPerformUnitOCR={onPerformUnitOCR}
              onStartDrawing={onStartDrawing}
            />
          ) : (
            <UnitDataMode />
          ))}
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
        {drawingMode === 'amenity' && (
          <AmenityMode
            amenityState={amenityState}
            onStartDrawing={onStartDrawing}
          />
        )}
      </div>
    </SidebarWrapper>
  )
}
