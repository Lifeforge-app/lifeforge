import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { createNewOutlineCircle } from '../../utils/unitUtils'

export function useOutlineCircle() {
  const {
    startDrawing,
    clearDrawingAndDeselect: clearDrawing,
    selectedElementId,
    setSelectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const buildingOutlineCircles = selectedFloor?.buildingOutlineCircles || []

  const selectedCircle = buildingOutlineCircles.find(
    c => c.id === selectedElementId
  )

  const handleCircleNameChange = (name: string) => {
    if (selectedFloor && selectedCircle) {
      updateFloor(selectedFloor.id, {
        buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
          c.id === selectedCircle.id ? { ...c, name } : c
        )
      })
    }
  }

  const handleCircleColorChange = (color: string) => {
    if (selectedFloor && selectedCircle) {
      updateFloor(selectedFloor.id, {
        buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
          c.id === selectedCircle.id ? { ...c, color } : c
        )
      })
    }
  }

  const handleCircleStrokeWidthChange = (strokeWidth: number) => {
    if (selectedFloor && selectedCircle) {
      updateFloor(selectedFloor.id, {
        buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
          c.id === selectedCircle.id ? { ...c, strokeWidth } : c
        )
      })
    }
  }

  const handleCircleCenterChange = (axis: 0 | 1, value: number) => {
    if (!selectedFloor || !selectedCircle) return

    const newCenter: [number, number] = [...selectedCircle.center]

    newCenter[axis] = value

    updateFloor(selectedFloor.id, {
      buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
        c.id === selectedCircle.id ? { ...c, center: newCenter } : c
      )
    })
  }

  const handleCircleRadiusChange = (radius: number) => {
    if (!selectedFloor || !selectedCircle) return

    updateFloor(selectedFloor.id, {
      buildingOutlineCircles: selectedFloor.buildingOutlineCircles.map(c =>
        c.id === selectedCircle.id ? { ...c, radius } : c
      )
    })
  }

  const handleNewCircle = () => {
    if (!selectedFloor) return

    const newCircle = createNewOutlineCircle()

    updateFloor(selectedFloor.id, {
      buildingOutlineCircles: [
        ...selectedFloor.buildingOutlineCircles,
        newCircle
      ]
    })
    setSelectedElementId(newCircle.id)
    startDrawing()
  }

  const handleDeleteCircle = () => {
    if (!selectedFloor || !selectedCircle) return

    updateFloor(selectedFloor.id, {
      buildingOutlineCircles: selectedFloor.buildingOutlineCircles.filter(
        c => c.id !== selectedCircle.id
      )
    })
    setSelectedElementId(null)
    clearDrawing()
  }

  return {
    selectedCircle,
    buildingOutlineCircles,
    handleCircleNameChange,
    handleCircleColorChange,
    handleCircleStrokeWidthChange,
    handleCircleCenterChange,
    handleCircleRadiusChange,
    handleNewCircle,
    handleDeleteCircle
  }
}
