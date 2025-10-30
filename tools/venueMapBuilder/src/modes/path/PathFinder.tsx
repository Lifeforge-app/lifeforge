import { Icon } from '@iconify/react'
import { Button, ListboxInput, ListboxOption } from 'lifeforge-ui'
import { useState } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { findShortestPath } from '../../utils/pathfinding'

export function PathFinder() {
  const { selectedFloor } = useFloors()

  const { setDisplayedPath } = useDrawing()

  const [fromUnitId, setFromUnitId] = useState<string>('')

  const [toUnitId, setToUnitId] = useState<string>('')

  const [calculatedPath, setCalculatedPath] = useState<{
    path: [number, number][]
    distance: number
  } | null>(null)

  if (!selectedFloor) return null

  const unitsWithEntrances = selectedFloor.units.filter(u => u.entranceLocation)

  const handleFindPath = () => {
    if (!fromUnitId || !toUnitId || !selectedFloor) return

    const fromUnit = selectedFloor.units.find(u => u.id === fromUnitId)

    const toUnit = selectedFloor.units.find(u => u.id === toUnitId)

    if (!fromUnit || !toUnit) return

    const result = findShortestPath(fromUnit, toUnit, selectedFloor.pathNodes)

    setCalculatedPath(result)

    // Display the path on the canvas
    if (result && result.path.length > 0) {
      setDisplayedPath(result.path)
    }
  }

  const handleClearPath = () => {
    setCalculatedPath(null)
    setFromUnitId('')
    setToUnitId('')
    setDisplayedPath(null)
  }

  return (
    <div className="border-bg-800 space-y-4 rounded-md border-2 p-4">
      <div className="flex items-center gap-2">
        <Icon className="size-6" icon="tabler:route-2" />
        <span className="text-lg font-medium">Path Finder</span>
      </div>

      {unitsWithEntrances.length < 2 ? (
        <div className="text-bg-500 text-sm">
          Need at least 2 units with entrance locations to find paths.
        </div>
      ) : (
        <>
          <ListboxInput
            buttonContent={
              <span>
                {fromUnitId
                  ? unitsWithEntrances.find(u => u.id === fromUnitId)?.name ||
                    'Select unit'
                  : 'Select unit'}
              </span>
            }
            disabled={calculatedPath !== null}
            icon="tabler:map-pin"
            label="From Unit"
            setValue={setFromUnitId}
            value={fromUnitId}
          >
            {unitsWithEntrances.map(unit => (
              <ListboxOption
                key={unit.id}
                label={unit.name || `Unit ${unit.id}`}
                value={unit.id}
              />
            ))}
          </ListboxInput>
          <ListboxInput
            buttonContent={
              <span>
                {toUnitId
                  ? unitsWithEntrances.find(u => u.id === toUnitId)?.name ||
                    'Select unit'
                  : 'Select unit'}
              </span>
            }
            disabled={calculatedPath !== null}
            icon="tabler:flag"
            label="To Unit"
            setValue={setToUnitId}
            value={toUnitId}
          >
            {unitsWithEntrances.map(unit => (
              <ListboxOption
                key={unit.id}
                label={unit.name || `Unit ${unit.id}`}
                value={unit.id}
              />
            ))}
          </ListboxInput>

          {calculatedPath && calculatedPath?.path.length > 0 ? (
            <Button
              dangerous
              className="mt-2 w-full"
              icon="tabler:x"
              variant="secondary"
              onClick={handleClearPath}
            >
              Clear Path
            </Button>
          ) : (
            <Button
              className="w-full"
              disabled={!fromUnitId || !toUnitId || fromUnitId === toUnitId}
              icon="tabler:search"
              onClick={handleFindPath}
            >
              Find Shortest Path
            </Button>
          )}
        </>
      )}
    </div>
  )
}
