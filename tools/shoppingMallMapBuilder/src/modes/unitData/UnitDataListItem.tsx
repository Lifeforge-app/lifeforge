import clsx from 'clsx'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import type { UnitDataEntry } from '../../types'

function UnitDataListItem({
  entry,
  displayOnly
}: {
  entry: UnitDataEntry
  displayOnly?: boolean
}) {
  const { floors, setSelectedFloorId } = useFloors()

  const { setSelectedElementId, setDrawingMode } = useDrawing()

  const hasCorrespondingUnit = floors.some(floor =>
    floor.units.some(
      unit => unit.name.replace(/\s/g, '') === entry.unit.replace(/\s/g, '')
    )
  )

  const handleUnitClick = (unitName: string) => {
    // Find the floor and unit that matches the unit name
    for (const floor of floors) {
      const unit = floor.units.find(
        u => u.name.replace(/\s/g, '') === unitName.replace(/\s/g, '')
      )

      if (unit) {
        // Switch to the floor
        setSelectedFloorId(floor.id)

        // Switch to units mode
        setDrawingMode('units')

        // Focus on the unit
        setSelectedElementId(unit.id)

        break
      }
    }
  }

  return (
    <button
      className={clsx(
        'flex w-full items-center gap-3 rounded-md border-2 p-4 text-left transition-all',
        displayOnly && 'cursor-default! hover:bg-transparent!',
        !hasCorrespondingUnit
          ? 'cursor-not-allowed border-red-500'
          : 'border-bg-800 hover:bg-bg-800'
      )}
      disabled={!hasCorrespondingUnit || displayOnly}
      onClick={() => {
        handleUnitClick(entry.unit)
      }}
    >
      <img alt="" className="size-12 object-contain" src={entry.logoUrl} />
      <div>
        <div className="font-medium">{entry.name}</div>
        <div
          className={clsx(
            'mt-1 text-xs',
            hasCorrespondingUnit ? 'text-custom-500' : 'text-red-500'
          )}
        >
          {entry.unit}
        </div>
      </div>
    </button>
  )
}

export default UnitDataListItem
