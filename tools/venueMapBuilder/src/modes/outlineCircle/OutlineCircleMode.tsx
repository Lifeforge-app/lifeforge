import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { OutlineCircleEditor } from './OutlineCircleEditor'
import { OutlineCircleList } from './OutlineCircleList'
import type { useOutlineCircle } from './useOutlineCircle'

function OutlineCircleMode({
  circleState,
  onStartDrawing
}: {
  circleState: ReturnType<typeof useOutlineCircle>
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
          onClick={circleState.handleNewCircle}
        >
          New Circle
        </Button>
      )}
      {!circleState.selectedCircle ? (
        <OutlineCircleList circles={selectedFloor.buildingOutlineCircles} />
      ) : (
        <OutlineCircleEditor
          circleState={circleState}
          isDrawing={isDrawing}
          onStartDrawing={onStartDrawing}
        />
      )}
    </div>
  )
}

export default OutlineCircleMode
