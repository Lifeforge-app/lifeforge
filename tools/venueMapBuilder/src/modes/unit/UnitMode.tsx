import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import type { HighlightedCoord } from '../../types'
import { UnitEditor } from './UnitEditor'
import { UnitList } from './UnitList'
import type { useUnit } from './useUnit'

function UnitMode({
  unitState,
  onAlignCoordinates,
  onFinishDrawing,
  onHighlightCoord,
  onPerformUnitOCR,
  onStartDrawing
}: {
  unitState: ReturnType<typeof useUnit>
  onAlignCoordinates: () => void
  onFinishDrawing: () => void
  onHighlightCoord: (coord: HighlightedCoord | null) => void
  onPerformUnitOCR: () => Promise<void>
  onStartDrawing: () => void
}) {
  const { isDrawing, selectedElementId } = useDrawing()

  const { selectedFloor } = useFloors()

  return (
    <div className="overflow-y-auto">
      {!selectedElementId && (
        <Button
          className="mb-6 w-full"
          icon="tabler:plus"
          onClick={unitState.handleNewUnit}
        >
          New Unit
        </Button>
      )}
      {!unitState.selectedUnit ? (
        <UnitList units={selectedFloor.units} />
      ) : (
        <UnitEditor
          floorPlanImage={selectedFloor.floorPlanImage}
          isDrawing={isDrawing}
          units={selectedFloor.units}
          unitState={unitState}
          onAlignCoordinates={onAlignCoordinates}
          onFinishDrawing={onFinishDrawing}
          onHighlightCoord={onHighlightCoord}
          onPerformOCR={onPerformUnitOCR}
          onStartDrawing={onStartDrawing}
        />
      )}
    </div>
  )
}

export default UnitMode
