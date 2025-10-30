import { createContext, useContext, useEffect, useState } from 'react'

import type { CoordinateWithSnapInfo, DrawingMode } from '../types'

interface FloorsContextType {
  selectedElementId: string | null
  drawingMode: DrawingMode
  isDrawing: boolean
  isSettingEntrance: boolean
  newCoordinates: CoordinateWithSnapInfo[]
  alignAfterDrawing: boolean
  setSelectedElementId: (id: string | null) => void
  setDrawingMode: (mode: DrawingMode) => void
  setAlignAfterDrawing: (align: boolean) => void
  setIsSettingEntrance: (isSetting: boolean) => void
  startDrawing: (
    existingCoordinates?: [number, number][],
    isControlPressed?: boolean
  ) => void
  addPoint: (point: [number, number], isSnapped?: boolean) => void
  removeLastPoint: () => void
  clearDrawingAndDeselect: () => void
  finishDrawing: () => {
    coords: CoordinateWithSnapInfo['coords'][]
    coordsWithSnapInfo: CoordinateWithSnapInfo[]
  }
}

const DrawingContext = createContext<FloorsContextType | null>(null)

function DrawingProvider({ children }: { children: React.ReactNode }) {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('units')

  const [isDrawing, setIsDrawing] = useState(false)

  const [isSettingEntrance, setIsSettingEntrance] = useState(false)

  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  )

  const [newCoordinates, setNewCoordinates] = useState<
    CoordinateWithSnapInfo[]
  >([])

  const [alignAfterDrawing, setAlignAfterDrawing] = useState(true)

  const startDrawing = (
    existingCoordinates?: [number, number][],
    isControlPressed?: boolean
  ) => {
    setIsDrawing(true)

    // If Control is pressed and there are existing coordinates, append to them
    if (
      isControlPressed &&
      existingCoordinates &&
      existingCoordinates.length > 0
    ) {
      setNewCoordinates(
        existingCoordinates.map(coords => ({ coords, isSnapped: false }))
      )
    } else {
      setNewCoordinates([])
    }
  }

  const addPoint = (point: [number, number], isSnapped = false) => {
    setNewCoordinates(prev => [...prev, { coords: point, isSnapped }])
  }

  const removeLastPoint = () => {
    setNewCoordinates(prev => prev.slice(0, -1))
  }

  const clearDrawingAndDeselect = () => {
    setSelectedElementId(null)
    setIsDrawing(false)
    setNewCoordinates([])
  }

  const finishDrawing = () => {
    const coords = newCoordinates.map(c => c.coords)

    clearDrawingAndDeselect()

    return { coords, coordsWithSnapInfo: newCoordinates }
  }

  useEffect(() => {
    clearDrawingAndDeselect()
  }, [drawingMode])

  return (
    <DrawingContext
      value={{
        selectedElementId,
        drawingMode,
        isDrawing,
        isSettingEntrance,
        newCoordinates,
        alignAfterDrawing,
        setSelectedElementId,
        setDrawingMode,
        setAlignAfterDrawing,
        setIsSettingEntrance,
        startDrawing,
        addPoint,
        removeLastPoint,
        clearDrawingAndDeselect,
        finishDrawing
      }}
    >
      {children}
    </DrawingContext>
  )
}

export function useDrawing() {
  const context = useContext(DrawingContext)

  if (!context) {
    throw new Error('useDrawing must be used within a DrawingProvider')
  }

  return context
}

export default DrawingProvider
