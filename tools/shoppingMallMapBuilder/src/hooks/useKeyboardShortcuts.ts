import { useEffect } from 'react'

import { useAmenities } from '../providers/AmenitiesProvider'
import { useDrawing } from '../providers/DrawingProvider'

export function useKeyboardShortcuts({
  onNewUnit,
  onNewOutline,
  onNewOutlineCircle,
  onNewAmenity,
  onNewPathNode,
  onFinishDrawing
}: {
  onNewUnit: () => void
  onNewOutline: () => void
  onNewOutlineCircle: () => void
  onNewAmenity: (amenityTypeId: string) => void
  onNewPathNode: () => void
  onFinishDrawing: () => void
}) {
  const { selectedAmenityTypeId } = useAmenities()

  const {
    drawingMode,
    isDrawing,
    setDrawingMode,
    selectedElementId,
    displayedPath,
    removeLastPoint: onUndoPoint,
    isConnectingNodes,
    setIsConnectingNodes,
    isSettingEntrance,
    setIsSettingEntrance
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

      // Disable all keyboard shortcuts when a path is being displayed
      if (displayedPath) {
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
        if (isDrawing) {
          return
        }
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
        } else if (drawingMode === 'path') {
          onNewPathNode()
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

      // E key: Toggle entrance setting mode (only when a unit is selected and not in drawing mode)
      if (e.key === 'e' || e.key === 'E') {
        if (!isDrawing && drawingMode === 'units' && selectedElementId) {
          e.preventDefault()
          setIsSettingEntrance(!isSettingEntrance)
        }
      }

      // C key: Toggle connection mode (only when a path node is selected and not in drawing mode)
      if (e.key === 'c' || e.key === 'C') {
        if (!isDrawing && drawingMode === 'path' && selectedElementId) {
          e.preventDefault()
          setIsConnectingNodes(!isConnectingNodes)
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
    selectedElementId,
    selectedAmenityTypeId,
    isConnectingNodes,
    isSettingEntrance,
    setDrawingMode,
    onNewUnit,
    onNewOutline,
    onNewOutlineCircle,
    onNewAmenity,
    onNewPathNode,
    onUndoPoint,
    onFinishDrawing,
    setIsConnectingNodes,
    setIsSettingEntrance
  ])
}
