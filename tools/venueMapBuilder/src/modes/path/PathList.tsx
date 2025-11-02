import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { usePath } from './usePath'

interface PathListProps {
  pathState: ReturnType<typeof usePath>
}

export function PathList({ pathState }: PathListProps) {
  const { setSelectedElementId } = useDrawing()

  if (pathState.pathNodes.length === 0) {
    return (
      <div className="text-bg-500 text-center text-sm">
        No path nodes yet. Create one to start building paths.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {pathState.pathNodes.map((node, index) => (
        <Button
          key={node.id}
          className="w-full justify-start"
          icon="tabler:route"
          variant="plain"
          onClick={() => setSelectedElementId(node.id)}
        >
          <div className="flex w-full min-w-0 items-center justify-between gap-8">
            <span className="w-full min-w-0 truncate text-left">
              Node {index + 1}
            </span>
            <span className="text-bg-500 text-sm">
              {node.connectedNodeIds.length} connections
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
