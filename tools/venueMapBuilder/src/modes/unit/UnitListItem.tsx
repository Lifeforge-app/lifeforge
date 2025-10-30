import { Button } from 'lifeforge-ui'
import { useMemo } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useUnitData } from '../../providers/UnitDataProvider'
import type { Unit } from '../../types'

function UnitListItem({ unit }: { unit: Unit }) {
  const { setSelectedElementId } = useDrawing()

  const { unitData } = useUnitData()

  const targetUnitData = useMemo(
    () =>
      unitData.find(
        data =>
          data.unit.toLowerCase().replace(/\s+/g, '') ===
          unit.name.toLowerCase().replace(/\s+/g, '')
      ),
    [unitData, unit.id]
  )

  return (
    <Button
      key={unit.id}
      className="w-full justify-start"
      icon="tabler:building-store"
      variant="plain"
      onClick={() => {
        setSelectedElementId(unit.id)
      }}
    >
      <div className="flex w-full min-w-0 items-center justify-between gap-8">
        {targetUnitData ? (
          <div className="text-left">
            <div className="font-medium">{targetUnitData.unit}</div>
            <div className="text-bg-600 w-full min-w-0 truncate text-left text-xs">
              {targetUnitData.name}
            </div>
          </div>
        ) : (
          <span className="w-full min-w-0 truncate text-left">
            {unit.name || 'Unnamed Unit'}
          </span>
        )}
        <span className="text-bg-500 text-sm">
          {unit.coordinates.length} pts
        </span>
      </div>
    </Button>
  )
}

export default UnitListItem
