import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { createNewUnit } from '../../utils/unitUtils'

export function useUnit() {
  const {
    startDrawing,
    clearDrawingAndDeselect: clearDrawing,
    selectedElementId,
    setSelectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const units = selectedFloor?.units || []

  const selectedUnit = units.find(u => u.id === selectedElementId)

  const handleUnitNameChange = (value: string) => {
    if (selectedFloor && selectedUnit) {
      updateFloor(selectedFloor.id, {
        units: selectedFloor.units.map(u =>
          u.id === selectedUnit.id ? { ...u, name: value } : u
        )
      })
    }
  }

  const handleCoordinateChange = (
    index: number,
    axis: 0 | 1,
    value: number
  ) => {
    if (!selectedFloor || !selectedUnit) return

    const newCoords = [...selectedUnit.coordinates]

    newCoords[index][axis] = value

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.map(u =>
        u.id === selectedUnit.id ? { ...u, coordinates: newCoords } : u
      )
    })
  }

  const handleCoordinateDelete = (index: number) => {
    if (!selectedFloor || !selectedUnit) return

    const newCoords = selectedUnit.coordinates.filter((_, i) => i !== index)

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.map(u =>
        u.id === selectedUnit.id ? { ...u, coordinates: newCoords } : u
      )
    })
  }

  const handleClearCoordinates = () => {
    if (!selectedFloor || !selectedUnit) return

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.map(u =>
        u.id === selectedUnit.id ? { ...u, coordinates: [] } : u
      )
    })
  }

  const handleLabelOffsetXChange = (value: number) => {
    if (!selectedFloor || !selectedUnit) return

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.map(u =>
        u.id === selectedUnit.id ? { ...u, labelOffsetX: value } : u
      )
    })
  }

  const handleLabelOffsetYChange = (value: number) => {
    if (!selectedFloor || !selectedUnit) return

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.map(u =>
        u.id === selectedUnit.id ? { ...u, labelOffsetY: value } : u
      )
    })
  }

  const handleNewUnit = () => {
    if (!selectedFloor) return

    const newUnit = createNewUnit(selectedFloor.id)

    updateFloor(selectedFloor.id, {
      units: [...selectedFloor.units, newUnit]
    })
    setSelectedElementId(newUnit.id)
    startDrawing()
  }

  const handleDeleteUnit = () => {
    if (!selectedFloor || !selectedUnit) return

    updateFloor(selectedFloor.id, {
      units: selectedFloor.units.filter(u => u.id !== selectedUnit.id)
    })
    setSelectedElementId(null)
    clearDrawing()
  }

  return {
    selectedUnit,
    handleUnitNameChange,
    handleCoordinateChange,
    handleCoordinateDelete,
    handleClearCoordinates,
    handleLabelOffsetXChange,
    handleLabelOffsetYChange,
    handleNewUnit,
    handleDeleteUnit
  }
}
