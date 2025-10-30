import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { OutlineEditor } from './OutlineEditor'
import { OutlineList } from './OutlineList'
import type { useOutline } from './useOutline'

function OutlineMode({
  outlineState,
  onStartDrawing,
  onFinishDrawing
}: {
  outlineState: ReturnType<typeof useOutline>
  onStartDrawing: () => void
  onFinishDrawing: () => void
}) {
  const { isDrawing } = useDrawing()

  const { selectedFloor } = useFloors()

  return (
    <>
      <div className="mb-6">
        <Button
          className="w-full"
          icon="tabler:plus"
          onClick={outlineState.handleNewOutline}
        >
          New Line
        </Button>
      </div>
      {!outlineState.selectedOutline ? (
        <OutlineList outlines={selectedFloor.buildingOutlines} />
      ) : (
        <OutlineEditor
          isDrawing={isDrawing}
          outlineState={outlineState}
          onFinishDrawing={onFinishDrawing}
          onStartDrawing={onStartDrawing}
        />
      )}
    </>
  )
}

export default OutlineMode
