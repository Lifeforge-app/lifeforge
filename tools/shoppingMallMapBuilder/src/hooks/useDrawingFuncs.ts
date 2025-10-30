import { useEffect } from 'react'

import type { useAmenity } from '../modes/amenities/useAmenity'
import type { useOutline } from '../modes/outline/useOutline'
import type { useUnit } from '../modes/unit/useUnit'
import { useControlKeyState } from '../providers/ControlKeyStateProvider'
import { useDrawing } from '../providers/DrawingProvider'
import { useFloors } from '../providers/FloorsProvider'
import { alignCoordinates } from '../utils/unitUtils'

function useDrawingFuncs({
  unitState,
  outlineState,
  amenityState
}: {
  unitState: ReturnType<typeof useUnit>
  outlineState: ReturnType<typeof useOutline>
  amenityState: ReturnType<typeof useAmenity>
}) {
  const isControlPressed = useControlKeyState()

  const {
    isDrawing,
    drawingMode,
    newCoordinates,
    alignAfterDrawing,
    clearDrawingAndDeselect: clearDrawing,
    startDrawing,
    finishDrawing,
    selectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const handleStartDrawing = () => {
    if (drawingMode === 'units') {
      startDrawing(unitState.selectedUnit?.coordinates, isControlPressed)
    } else if (drawingMode === 'outline') {
      startDrawing(outlineState.selectedOutline?.segments, isControlPressed)
    } else if (drawingMode === 'amenity') {
      startDrawing(
        amenityState.selectedAmenity
          ? [amenityState.selectedAmenity.coordinate]
          : undefined,
        isControlPressed
      )
    }
  }

  const handleFinishDrawing = () => {
    if (!selectedFloor) return

    if (drawingMode === 'units') {
      if (!selectedElementId || newCoordinates.length < 3) {
        clearDrawing()

        return
      }

      const { coords, coordsWithSnapInfo } = finishDrawing()

      const finalCoords = alignAfterDrawing
        ? alignCoordinates(coords, coordsWithSnapInfo)
        : coords

      updateFloor(selectedFloor.id, {
        units: selectedFloor.units.map(u =>
          u.id === selectedElementId ? { ...u, coordinates: finalCoords } : u
        )
      })
    } else if (drawingMode === 'outline') {
      if (!selectedElementId || newCoordinates.length < 2) {
        clearDrawing()

        return
      }

      const { coords } = finishDrawing()

      updateFloor(selectedFloor.id, {
        buildingOutlines: selectedFloor.buildingOutlines.map(o =>
          o.id === selectedElementId ? { ...o, segments: coords } : o
        )
      })
    } else if (drawingMode === 'outline-circle') {
      if (!selectedElementId || newCoordinates.length < 2) {
        clearDrawing()

        return
      }

      const { coords } = finishDrawing()

      const center = coords[0]

      const edgePoint = coords[1]

      const radius = Math.sqrt(
        Math.pow(edgePoint[0] - center[0], 2) +
          Math.pow(edgePoint[1] - center[1], 2)
      )

      updateFloor(selectedFloor.id, {
        buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
          c.id === selectedElementId ? { ...c, center, radius } : c
        )
      })
    } else if (drawingMode === 'amenity') {
      if (!selectedElementId || newCoordinates.length < 1) {
        clearDrawing()

        return
      }

      const { coords } = finishDrawing()

      updateFloor(selectedFloor.id, {
        amenities: selectedFloor.amenities.map(a =>
          a.id === selectedElementId ? { ...a, coordinate: coords[0] } : a
        )
      })
    }
  }

  useEffect(() => {
    if (
      (drawingMode === 'outline-circle' || drawingMode === 'amenity') &&
      isDrawing &&
      newCoordinates.length === (drawingMode === 'outline-circle' ? 2 : 1)
    ) {
      handleFinishDrawing()
    }
  }, [newCoordinates.length, drawingMode, isDrawing])

  return {
    handleStartDrawing,
    handleFinishDrawing
  }
}

export default useDrawingFuncs
