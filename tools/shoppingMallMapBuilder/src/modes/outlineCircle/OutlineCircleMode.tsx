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
  const { isDrawing } = useDrawing()

  const { selectedFloor } = useFloors()

  return (
    <>
      <div className="mb-6">
        <Button
          className="w-full"
          icon="tabler:plus"
          onClick={circleState.handleNewCircle}
        >
          New Circle
        </Button>
      </div>
      {!circleState.selectedCircle ? (
        <OutlineCircleList
          circles={selectedFloor.buildingOutlineCircles}
        />
      ) : (
        <OutlineCircleEditor
          circleState={circleState}
          isDrawing={isDrawing}
          onStartDrawing={onStartDrawing}
        />
      )}
    </>
  )
}

export default OutlineCircleMode
