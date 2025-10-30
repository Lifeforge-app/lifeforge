import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
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
  onHighlightCoord: () => void
  onPerformUnitOCR: () => Promise<void>
  onStartDrawing: () => void
}) {
  const { isDrawing } = useDrawing()

  const { selectedFloor } = useFloors()

  return (
    <>
      <div className="mb-6 space-y-2">
        <Button
          className="w-full"
          icon="tabler:plus"
          onClick={unitState.handleNewUnit}
        >
          New Unit
        </Button>
      </div>
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
    </>
  )
}

export default UnitMode
