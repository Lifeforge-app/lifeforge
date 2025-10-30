import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { Outline } from '../../types'

interface OutlineListProps {
  outlines: Outline[]
}

export function OutlineList({ outlines }: OutlineListProps) {
  const { setSelectedElementId } = useDrawing()

  if (outlines.length === 0) {
    return (
      <div className="text-bg-500 mt-4 text-center">
        No building outlines yet. Create one to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {outlines.map(outline => (
        <Button
          key={outline.id}
          className="w-full justify-start"
          icon="tabler:building"
          variant="plain"
          onClick={() => {
            setSelectedElementId(outline.id)
          }}
        >
          <div className="flex w-full items-center justify-between">
            <span>{outline.name || 'Unnamed Outline'}</span>
            <span className="text-bg-500 text-sm">
              {outline.segments.length} pts
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
