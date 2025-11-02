import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import { alignCoordinates, createNewOutline } from '../../utils/unitUtils'

export function useOutline() {
  const {
    startDrawing,
    clearDrawingAndDeselect: clearDrawing,
    selectedElementId,
    setSelectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const buildingOutlines = selectedFloor?.buildingOutlines || []

  const selectedOutline = buildingOutlines.find(o => o.id === selectedElementId)

  const handleOutlineNameChange = (name: string) => {
    if (selectedFloor && selectedOutline) {
      updateFloor(selectedFloor.id, {
        buildingOutlines: selectedFloor.buildingOutlines.map(o =>
          o.id === selectedOutline.id ? { ...o, name } : o
        )
      })
    }
  }

  const handleOutlineColorChange = (color: string) => {
    if (selectedFloor && selectedOutline) {
      updateFloor(selectedFloor.id, {
        buildingOutlines: selectedFloor.buildingOutlines.map(o =>
          o.id === selectedOutline.id ? { ...o, color } : o
        )
      })
    }
  }

  const handleOutlineStrokeWidthChange = (strokeWidth: number) => {
    if (selectedFloor && selectedOutline) {
      updateFloor(selectedFloor.id, {
        buildingOutlines: selectedFloor.buildingOutlines.map(o =>
          o.id === selectedOutline.id ? { ...o, strokeWidth } : o
        )
      })
    }
  }

  const handleSegmentChange = (index: number, axis: 0 | 1, value: number) => {
    if (!selectedFloor || !selectedOutline) return

    const newSegments = [...selectedOutline.segments]

    newSegments[index][axis] = value

    updateFloor(selectedFloor.id, {
      buildingOutlines: selectedFloor.buildingOutlines.map(o =>
        o.id === selectedOutline.id ? { ...o, segments: newSegments } : o
      )
    })
  }

  const handleAlignCoordinates = () => {
    if (!selectedFloor || !selectedOutline) return

    const aligned = alignCoordinates(selectedOutline.segments)

    updateFloor(selectedFloor.id, {
      buildingOutlines: selectedFloor.buildingOutlines.map(o =>
        o.id === selectedOutline.id ? { ...o, segments: aligned } : o
      )
    })
  }

  const handleSegmentDelete = (index: number) => {
    if (!selectedFloor || !selectedOutline) return

    const newSegments = selectedOutline.segments.filter((_, i) => i !== index)

    updateFloor(selectedFloor.id, {
      buildingOutlines: selectedFloor.buildingOutlines.map(o =>
        o.id === selectedOutline.id ? { ...o, segments: newSegments } : o
      )
    })
  }

  const handleClearSegments = () => {
    if (!selectedFloor || !selectedOutline) return

    updateFloor(selectedFloor.id, {
      buildingOutlines: selectedFloor.buildingOutlines.map(o =>
        o.id === selectedOutline.id ? { ...o, segments: [] } : o
      )
    })
  }

  const handleNewOutline = () => {
    if (!selectedFloor) return

    const newOutline = createNewOutline()

    updateFloor(selectedFloor.id, {
      buildingOutlines: [...selectedFloor.buildingOutlines, newOutline]
    })
    setSelectedElementId(newOutline.id)
    startDrawing()
  }

  const handleDeleteOutline = () => {
    if (!selectedFloor || !selectedOutline) return

    updateFloor(selectedFloor.id, {
      buildingOutlines: selectedFloor.buildingOutlines.filter(
        o => o.id !== selectedOutline.id
      )
    })
    setSelectedElementId(null)
    clearDrawing()
  }

  return {
    selectedOutline,
    buildingOutlines,
    handleOutlineNameChange,
    handleOutlineColorChange,
    handleOutlineStrokeWidthChange,
    handleAlignCoordinates,
    handleSegmentChange,
    handleSegmentDelete,
    handleClearSegments,
    handleNewOutline,
    handleDeleteOutline
  }
}
