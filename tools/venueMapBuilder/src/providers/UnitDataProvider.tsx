import { createContext, useContext, useEffect, useState } from 'react'

import type { UnitDataEntry } from '../types'
import {
  DEFAULT_APP_DATA,
  loadAppData,
  updateAppData
} from '../utils/storageUtils'

interface UnitDataContextType {
  unitData: UnitDataEntry[]
  setUnitData: (data: UnitDataEntry[]) => void
  addUnitData: (data: UnitDataEntry) => void
  updateUnitDataEntry: (index: number, data: UnitDataEntry) => void
  deleteUnitDataEntry: (index: number) => void
  findUnitDataByUnitName: (unitName: string) => UnitDataEntry | undefined
}

const UnitDataContext = createContext<UnitDataContextType | null>(null)

function UnitDataProvider({ children }: { children: React.ReactNode }) {
  const [unitData, setUnitData] = useState<UnitDataEntry[]>(() => {
    const data = loadAppData()

    return data.unitData || DEFAULT_APP_DATA.unitData
  })

  // Save unit data to localStorage whenever it changes
  useEffect(() => {
    updateAppData({ unitData })
  }, [unitData])

  const addUnitData = (data: UnitDataEntry) => {
    setUnitData(prev => [...prev, data])
  }

  const updateUnitDataEntry = (index: number, data: UnitDataEntry) => {
    setUnitData(prev => prev.map((entry, i) => (i === index ? data : entry)))
  }

  const deleteUnitDataEntry = (index: number) => {
    setUnitData(prev => prev.filter((_, i) => i !== index))
  }

  const findUnitDataByUnitName = (unitName: string) => {
    return unitData.find(entry => entry.unit === unitName)
  }

  return (
    <UnitDataContext
      value={{
        unitData,
        setUnitData,
        addUnitData,
        updateUnitDataEntry,
        deleteUnitDataEntry,
        findUnitDataByUnitName
      }}
    >
      {children}
    </UnitDataContext>
  )
}

export function useUnitData() {
  const context = useContext(UnitDataContext)

  if (!context) {
    throw new Error('useUnitData must be used within a UnitDataProvider')
  }

  return context
}

export default UnitDataProvider
