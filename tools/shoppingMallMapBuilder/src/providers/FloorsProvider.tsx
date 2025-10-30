import { createContext, useContext, useEffect, useState } from 'react'

import type { Floor } from '../types'
import {
  DEFAULT_APP_DATA,
  loadAppData,
  updateAppData
} from '../utils/storageUtils'

interface FloorContextType {
  floors: Floor[]
  setFloors: (floors: Floor[]) => void
  selectedFloorId: string
  setSelectedFloorId: (id: string) => void
  selectedFloor: Floor
  updateFloor: (floorId: string, updates: Partial<Omit<Floor, 'id'>>) => void
  deleteFloor: (floorId: string) => void
  addFloor: (floor: Floor) => void
}

const FloorContext = createContext<FloorContextType | null>(null)

function FloorProvider({ children }: { children: React.ReactNode }) {
  const [floors, setFloors] = useState<Floor[]>(() => {
    const data = loadAppData()

    // If no floors exist, create a default ground floor
    if (data.floors.length === 0) {
      return DEFAULT_APP_DATA.floors
    }

    // Ensure all floors have buildingOutlineCircles and amenities (migration for old data)
    return data.floors.map(floor => ({
      ...floor,
      buildingOutlineCircles: floor.buildingOutlineCircles || [],
      amenities: floor.amenities || []
    }))
  })

  const [selectedFloorId, setSelectedFloorId] = useState<string>(() => {
    const data = loadAppData()

    return data.selectedFloorId || (floors.length > 0 ? floors[0].id : 'G')
  })

  // Save floors to localStorage whenever they change
  useEffect(() => {
    updateAppData({ floors })
  }, [floors])

  // Save selected floor to localStorage whenever it changes
  useEffect(() => {
    updateAppData({ selectedFloorId })
  }, [selectedFloorId])

  const selectedFloor =
    floors.find(f => f.id === selectedFloorId) ||
    floors[0] ||
    DEFAULT_APP_DATA.floors[0]

  const updateFloor = (floorId: string, updates: Partial<Floor>) => {
    setFloors(prevFloors =>
      prevFloors.map(f => (f.id === floorId ? { ...f, ...updates } : f))
    )
  }

  const deleteFloor = (floorId: string) => {
    setFloors(prevFloors => prevFloors.filter(f => f.id !== floorId))

    if (selectedFloorId === floorId) {
      const remainingFloors = floors.filter(f => f.id !== floorId)

      if (remainingFloors.length > 0) {
        setSelectedFloorId(remainingFloors[0].id)
      }
    }
  }

  const addFloor = (floor: Floor) => {
    setFloors(prevFloors => [...prevFloors, floor])
  }

  return (
    <FloorContext
      value={{
        floors,
        setFloors,
        selectedFloorId,
        setSelectedFloorId,
        selectedFloor,
        updateFloor,
        deleteFloor,
        addFloor
      }}
    >
      {children}
    </FloorContext>
  )
}

export function useFloors() {
  const context = useContext(FloorContext)

  if (!context) {
    throw new Error('useFloors must be used within a FloorProvider')
  }

  return context
}

export default FloorProvider
