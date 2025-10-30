import type { useUnit } from '../modes/unit/useUnit'
import { useFloors } from '../providers/FloorsProvider'
import { performOCROnPolygon } from '../utils/ocrUtils'
import { alignCoordinates } from '../utils/unitUtils'

function useUtilsFuncs({
  unitState
}: {
  unitState: ReturnType<typeof useUnit>
}) {
  const {
    selectedFloorId,
    selectedFloor: { floorPlanImage, units },
    updateFloor
  } = useFloors()

  const handleAlignCoordinates = () => {
    if (!unitState.selectedUnit) return

    const aligned = alignCoordinates(unitState.selectedUnit.coordinates)

    updateFloor(selectedFloorId, {
      units: units.map(u =>
        u.id === unitState.selectedUnit!.id ? { ...u, coordinates: aligned } : u
      )
    })
  }

  const handlePerformUnitOCR = async () => {
    if (!unitState.selectedUnit || !floorPlanImage) return

    try {
      const text = await performOCROnPolygon(
        floorPlanImage,
        unitState.selectedUnit.coordinates,
        undefined,
        { preprocess: true }
      )

      if (text) {
        updateFloor(selectedFloorId, {
          units: units.map(u =>
            u.id === unitState.selectedUnit!.id ? { ...u, name: text } : u
          )
        })
      }
    } catch (error) {
      console.error('OCR failed:', error)
      alert('OCR failed. Please try again.')
    }
  }

  return {
    handleAlignCoordinates,
    handlePerformUnitOCR
  }
}

export default useUtilsFuncs
