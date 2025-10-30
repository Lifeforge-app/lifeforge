import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'

export function useAmenity() {
  const {
    startDrawing,
    clearDrawingAndDeselect: clearDrawing,
    selectedElementId,
    setSelectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const amenities = selectedFloor?.amenities || []

  const selectedAmenity = amenities.find(a => a.id === selectedElementId)

  const handleCoordinateChange = (axis: 0 | 1, value: number) => {
    if (!selectedFloor || !selectedAmenity) return

    const newCoord: [number, number] = [...selectedAmenity.coordinate]

    newCoord[axis] = value

    updateFloor(selectedFloor.id, {
      amenities: selectedFloor.amenities.map(a =>
        a.id === selectedAmenity.id ? { ...a, coordinate: newCoord } : a
      )
    })
  }

  const handleAmenityTypeChange = (amenityTypeId: string) => {
    if (!selectedFloor || !selectedAmenity) return

    updateFloor(selectedFloor.id, {
      amenities: selectedFloor.amenities.map(a =>
        a.id === selectedAmenity.id ? { ...a, amenityTypeId } : a
      )
    })
  }

  const handleNewAmenity = (amenityTypeId: string) => {
    if (!selectedFloor) return

    const newAmenity = {
      id: `amenity-${Date.now()}`,
      amenityTypeId,
      coordinate: [0, 0] as [number, number]
    }

    updateFloor(selectedFloor.id, {
      amenities: [...selectedFloor.amenities, newAmenity]
    })
    setSelectedElementId(newAmenity.id)
    startDrawing()
  }

  const handleDeleteAmenity = () => {
    if (!selectedFloor || !selectedAmenity) return

    updateFloor(selectedFloor.id, {
      amenities: selectedFloor.amenities.filter(
        a => a.id !== selectedAmenity.id
      )
    })
    setSelectedElementId(null)
    clearDrawing()
  }

  return {
    selectedAmenity,
    handleCoordinateChange,
    handleAmenityTypeChange,
    handleNewAmenity,
    handleDeleteAmenity
  }
}
