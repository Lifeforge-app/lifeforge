import { useEffect } from 'react'

import { useAmenities } from '../providers/AmenitiesProvider'
import { useDrawing } from '../providers/DrawingProvider'

export function useKeyboardShortcuts({
  onNewUnit,
  onNewOutline,
  onNewOutlineCircle,
  onNewAmenity,
  onFinishDrawing
}: {
  onNewUnit: () => void
  onNewOutline: () => void
  onNewOutlineCircle: () => void
  onNewAmenity: (amenityTypeId: string) => void
  onFinishDrawing: () => void
}) {
  const { selectedAmenityTypeId } = useAmenities()

  const {
    drawingMode,
    isDrawing,
    setDrawingMode,
    removeLastPoint: onUndoPoint
  } = useDrawing()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if user is focusing on an input/textarea
      const target = e.target as HTMLElement

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // U key: Switch to units mode
      if (e.key === 'u' || e.key === 'U') {
        if (!isDrawing) {
          e.preventDefault()
          setDrawingMode('units')
        }
      }

      // B key: Switch to building outline mode
      if (e.key === 'b' || e.key === 'B') {
        if (!isDrawing) {
          e.preventDefault()
          setDrawingMode('outline')
        }
      }

      // N key: New unit/outline (only when not in drawing mode)
      if (e.key === 'n' || e.key === 'N') {
        if (!isDrawing) {
          e.preventDefault()

          if (drawingMode === 'units') {
            onNewUnit()
          } else if (drawingMode === 'outline') {
            onNewOutline()
          } else if (drawingMode === 'outline-circle') {
            onNewOutlineCircle()
          } else if (drawingMode === 'amenity') {
            if (selectedAmenityTypeId) {
              onNewAmenity(selectedAmenityTypeId)
            }
          }
        }
      }

      // Enter key: Finish drawing (only when in drawing mode)
      if (e.key === 'Enter') {
        if (isDrawing) {
          e.preventDefault()
          onFinishDrawing()
        }
      }

      // Z key: Undo last point (only when in drawing mode)
      if (e.key === 'z' || e.key === 'Z') {
        if (isDrawing) {
          e.preventDefault()
          onUndoPoint()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    drawingMode,
    isDrawing,
    setDrawingMode,
    onNewUnit,
    onNewOutline,
    onNewOutlineCircle,
    onNewAmenity,
    onUndoPoint,
    onFinishDrawing
  ])
}
