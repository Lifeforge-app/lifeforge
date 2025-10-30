import { Icon } from '@iconify/react'
import { Button, GoBackButton, Switch, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useControlKeyState } from '../../providers/ControlKeyStateProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import type { HighlightedCoord, Unit } from '../../types'
import { cropPolygonImage } from '../../utils/cropPolygonImage'
import type { useUnit } from './useUnit'

interface UnitEditorProps {
  unitState: ReturnType<typeof useUnit>
  units: Unit[]
  isDrawing: boolean
  floorPlanImage: string | null
  onAlignCoordinates: () => void
  onStartDrawing: () => void
  onFinishDrawing: () => void
  onHighlightCoord: (coord: HighlightedCoord | null) => void
  onPerformOCR: () => Promise<void>
}

export function UnitEditor({
  unitState,
  units,
  isDrawing,
  floorPlanImage,
  onAlignCoordinates,
  onStartDrawing,
  onFinishDrawing,
  onHighlightCoord,
  onPerformOCR
}: UnitEditorProps) {
  const isControlPressed = useControlKeyState()

  const {
    alignAfterDrawing,
    newCoordinates,
    setAlignAfterDrawing,
    setSelectedElementId,
    clearDrawingAndDeselect
  } = useDrawing()

  const unit = unitState.selectedUnit!

  const [isOCRProcessing, setIsOCRProcessing] = useState(false)

  const [croppedImage, setCroppedImage] = useState<string | null>(null)

  // Generate cropped image when coordinates or floor plan changes
  useEffect(() => {
    if (floorPlanImage && unit.coordinates.length >= 3) {
      cropPolygonImage(floorPlanImage, unit.coordinates)
        .then(setCroppedImage)
        .catch(err => {
          console.error('Failed to crop image:', err)
          setCroppedImage(null)
        })
    } else {
      setCroppedImage(null)
    }
  }, [floorPlanImage, unit.coordinates])

  const handleOCR = async () => {
    setIsOCRProcessing(true)

    try {
      await onPerformOCR()
    } finally {
      setIsOCRProcessing(false)
    }
  }

  const currentIndex = units.findIndex(u => u.id === unit.id)

  const hasPrevious = currentIndex > 0

  const hasNext = currentIndex < units.length - 1

  const handlePrevious = () => {
    if (hasPrevious) {
      setSelectedElementId(units[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      setSelectedElementId(units[currentIndex + 1].id)
    }
  }

  if (!unitState.selectedUnit) {
    return null
  }

  return (
    <>
      <GoBackButton onClick={clearDrawingAndDeselect} />
      <div className="border-bg-800 mt-4 rounded-md border-2 p-4">
        <div className="flex-between">
          <div className="flex items-center gap-2">
            <Icon className="size-6" icon="tabler:building-store" />
            <span className="text-lg font-medium">
              {unit.name || 'Unnamed Unit'}
            </span>
          </div>
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={unitState.handleDeleteUnit}
          />
        </div>
        {croppedImage && (
          <div className="border-bg-800 flex-center mt-4 w-full rounded-md border-2 p-2">
            <img
              alt="Cropped polygon preview"
              className="h-96 w-auto object-contain"
              src={croppedImage}
            />
          </div>
        )}
        <TextInput
          actionButtonProps={{
            icon: 'mage:stars-c',
            onClick: handleOCR,
            disabled: !floorPlanImage || unit.coordinates.length < 3,
            loading: isOCRProcessing
          }}
          className="mt-4"
          icon="tabler:123"
          label="Unit Name"
          placeholder="FX.XX"
          setValue={unitState.handleUnitNameChange}
          value={unit.name}
        />
        <div className="mt-4 flex items-center gap-2">
          <Button
            className="w-full"
            disabled={!hasPrevious}
            icon="tabler:arrow-left"
            variant="secondary"
            onClick={handlePrevious}
          >
            Prev
          </Button>
          <Button
            className="w-full"
            disabled={!hasNext}
            icon="tabler:arrow-right"
            variant="secondary"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
        {unit.coordinates.length > 0 && (
          <div className="border-bg-800 mt-4 space-y-2 rounded-md border-2 p-4">
            {unit.coordinates.map((coord, index) => (
              <div
                key={index}
                className="border-bg-800 flex items-center gap-2 rounded-md border-2 p-2"
              >
                <div className="space-y-2">
                  <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
                    <span className="text-bg-500 text-sm font-medium">
                      X Coords
                    </span>
                    <input
                      className="w-full"
                      type="number"
                      value={coord[0]}
                      onChange={e =>
                        unitState.handleCoordinateChange(
                          index,
                          0,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
                    <span className="text-bg-500 text-sm font-medium">
                      Y Coords
                    </span>
                    <input
                      className="w-full"
                      type="number"
                      value={coord[1]}
                      onChange={e =>
                        unitState.handleCoordinateChange(
                          index,
                          1,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    icon="tabler:eye"
                    variant="plain"
                    onMouseDown={() =>
                      onHighlightCoord({
                        unitId: unit.id,
                        index
                      })
                    }
                    onMouseLeave={() => {
                      onHighlightCoord(null)
                    }}
                    onMouseUp={() => {
                      onHighlightCoord(null)
                    }}
                  />
                  <Button
                    dangerous
                    className="w-full"
                    icon="tabler:trash"
                    variant="plain"
                    onClick={() => {
                      unitState.handleCoordinateDelete(index)
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              className="mt-2 w-full"
              icon="tabler:layout-align-middle"
              variant="secondary"
              onClick={onAlignCoordinates}
            >
              Align Coordinates
            </Button>
            <Button
              dangerous
              className="mt-2 w-full"
              icon="tabler:trash"
              variant="secondary"
              onClick={unitState.handleClearCoordinates}
            >
              Clear Points
            </Button>
          </div>
        )}

        {!isDrawing ? (
          <>
            <div className="mt-4 space-y-2">
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:plus" />
                <span>Press N to start drawing new points</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon className="shrink-0" icon="tabler:pencil-plus" />
                <span>
                  Hold Control while clicking the button below to append to
                  existing points
                </span>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              icon={isControlPressed ? 'tabler:pointer-plus' : 'tabler:pointer'}
              onClick={onStartDrawing}
            >
              {isControlPressed ? 'Append Drawing' : 'Draw from Scratch'}
            </Button>
          </>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:info-circle" />
                <span>
                  {isControlPressed
                    ? 'Drawing mode (pan enabled)'
                    : 'Drawing mode (pan disabled)'}
                </span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:hand-click" />
                <span>Click on the map to add points</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:keyboard" />
                <span>
                  Press Enter to finish ({newCoordinates.length} points)
                </span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:keyboard" />
                <span>Press Z to undo last point</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:hand-grab" />
                <span>Hold Control to enable panning</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-bg-500 flex items-center gap-2">
                <Icon className="size-6" icon="tabler:layout-align-center" />
                <span className="text-lg">Align after drawing</span>
              </div>
              <Switch
                checked={alignAfterDrawing}
                onChange={() => setAlignAfterDrawing(!alignAfterDrawing)}
              />
            </div>
            <Button
              className="mt-4 w-full"
              icon="tabler:check"
              variant="secondary"
              onClick={onFinishDrawing}
            >
              Finish Drawing ({newCoordinates.length} points)
            </Button>
          </>
        )}
      </div>
    </>
  )
}
