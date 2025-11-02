import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { OutlineCircle } from '../../types'

interface OutlineCircleListProps {
  circles: OutlineCircle[]
}

export function OutlineCircleList({ circles }: OutlineCircleListProps) {
  const { setSelectedElementId } = useDrawing()

  if (circles.length === 0) {
    return (
      <div className="text-bg-500 mt-4 text-center">
        No circles yet. Create one to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {circles.map(circle => (
        <Button
          key={circle.id}
          className="w-full justify-start"
          icon="tabler:circle"
          variant="plain"
          onClick={() => {
            setSelectedElementId(circle.id)
          }}
        >
          <div className="flex w-full min-w-0 items-center justify-between gap-8">
            <span className="w-full min-w-0 truncate text-left">
              {circle.name || 'Unnamed Circle'}
            </span>
            <span className="text-bg-500 text-sm">r: {circle.radius}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}
