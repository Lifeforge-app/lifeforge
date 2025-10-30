import { createContext, useContext, useEffect, useState } from 'react'

import type { AmenityType } from '../types'
import {
  DEFAULT_APP_DATA,
  loadAppData,
  updateAppData
} from '../utils/storageUtils'

interface AmenitiesContextType {
  amenityTypes: AmenityType[]
  selectedAmenityTypeId: string | null
  setAmenityTypes: (types: AmenityType[]) => void
  addAmenityType: (type: AmenityType) => void
  updateAmenityType: (id: string, updates: Partial<AmenityType>) => void
  deleteAmenityType: (id: string) => void
  setSelectedAmenityTypeId: (id: string | null) => void
}

const AmenitiesContext = createContext<AmenitiesContextType | null>(null)

function AmenitiesProvider({ children }: { children: React.ReactNode }) {
  const [amenityTypes, setAmenityTypes] = useState<AmenityType[]>(() => {
    const data = loadAppData()

    return data.amenityTypes || DEFAULT_APP_DATA.amenityTypes
  })

  const [selectedAmenityTypeId, setSelectedAmenityTypeId] = useState<
    string | null
  >(amenityTypes.length > 0 ? amenityTypes[0].id : null)

  // Save amenity types to localStorage whenever they change
  useEffect(() => {
    updateAppData({ amenityTypes })
  }, [amenityTypes])

  const addAmenityType = (type: AmenityType) => {
    setAmenityTypes(prev => [...prev, type])
  }

  const updateAmenityType = (id: string, updates: Partial<AmenityType>) => {
    setAmenityTypes(prev =>
      prev.map(type => (type.id === id ? { ...type, ...updates } : type))
    )
  }

  const deleteAmenityType = (id: string) => {
    setAmenityTypes(prev => prev.filter(type => type.id !== id))
  }

  return (
    <AmenitiesContext
      value={{
        amenityTypes,
        selectedAmenityTypeId,
        setAmenityTypes,
        addAmenityType,
        updateAmenityType,
        deleteAmenityType,
        setSelectedAmenityTypeId
      }}
    >
      {children}
    </AmenitiesContext>
  )
}

export function useAmenities() {
  const context = useContext(AmenitiesContext)

  if (!context) {
    throw new Error('useAmenities must be used within an AmenitiesProvider')
  }

  return context
}

export default AmenitiesProvider
