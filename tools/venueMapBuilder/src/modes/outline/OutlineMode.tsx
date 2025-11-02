import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import type { HighlightedCoord } from '../../types'
import { OutlineEditor } from './OutlineEditor'
import { OutlineList } from './OutlineList'
import type { useOutline } from './useOutline'

function OutlineMode({
  outlineState,
  onStartDrawing,
  onFinishDrawing,
  onHighlightCoord
}: {
  outlineState: ReturnType<typeof useOutline>
  onStartDrawing: () => void
  onFinishDrawing: () => void
  onHighlightCoord: (coord: HighlightedCoord | null) => void
}) {
  const { isDrawing, selectedElementId } = useDrawing()

  const { selectedFloor } = useFloors()

  return (
    <div className="overflow-y-auto">
      {!selectedElementId && (
        <Button
          className="mb-6 w-full"
          icon="tabler:plus"
          onClick={outlineState.handleNewOutline}
        >
          New Line
        </Button>
      )}
      {!outlineState.selectedOutline ? (
        <OutlineList outlines={selectedFloor.buildingOutlines} />
      ) : (
        <OutlineEditor
          isDrawing={isDrawing}
          outlineState={outlineState}
          onFinishDrawing={onFinishDrawing}
          onHighlightCoord={onHighlightCoord}
          onStartDrawing={onStartDrawing}
        />
      )}
    </div>
  )
}

export default OutlineMode
