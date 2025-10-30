import { Button } from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { Unit } from '../../types'

interface UnitListProps {
  units: Unit[]
}

export function UnitList({ units }: UnitListProps) {
  const { setSelectedElementId } = useDrawing()

  return (
    <div className="space-y-2">
      {units.map(unit => (
        <Button
          key={unit.id}
          className="w-full justify-start"
          icon="tabler:building"
          variant="plain"
          onClick={() => {
            setSelectedElementId(unit.id)
          }}
        >
          <div className="flex w-full min-w-0 items-center justify-between gap-8">
            <span className="w-full min-w-0 truncate text-left">
              {unit.name || 'Unnamed Unit'}
            </span>
            <span className="text-bg-500 text-sm">
              {unit.coordinates.length} pts
            </span>
          </div>
        </Button>
      ))}
    </div>
  )
}
