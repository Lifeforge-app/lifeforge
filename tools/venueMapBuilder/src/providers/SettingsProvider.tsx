import { createContext, useContext, useEffect, useState } from 'react'

import { exportMallData, importMallData } from '../utils/importExport'
import {
  DEFAULT_APP_DATA,
  loadAppData,
  updateAppData
} from '../utils/storageUtils'
import { useAmenities } from './AmenitiesProvider'
import { useDrawing } from './DrawingProvider'
import { useFloors } from './FloorsProvider'
import { useUnitData } from './UnitDataProvider'

interface SettingsContextType {
  mallName: string
  showFloorPlanImage: boolean
  unitLabelFontSize: number
  pointRadius: number
  showUnit: boolean
  showUnitOutline: boolean
  showPaths: boolean
  showAmenities: boolean
  showEntrances: boolean
  setMallName: (name: string) => void
  handleFloorPlanImageChange: (file: File | string | null) => void
  handleCreateFloor: (floorId: string, floorName: string) => void
  handleExport: () => void
  handleImport: () => void
  handleClearAllData: () => void
  handleFloorNameChange: (name: string) => void
  handleFloorIdChange: (newId: string) => void
  handleToggleShowFloorPlanImage: () => void
  handleUnitLabelFontSizeChange: (size: number) => void
  handlePointRadiusChange: (radius: number) => void
  handleToggleShowUnit: () => void
  handleToggleShowOutline: () => void
  handleToggleShowPaths: () => void
  handleToggleShowAmenities: () => void
  handleToggleShowEntrances: () => void
}

const SettingsContext = createContext<SettingsContextType | null>(null)

function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { clearDrawingAndDeselect: clearDrawing } = useDrawing()

  const {
    selectedFloor,
    updateFloor,
    addFloor,
    floors,
    setFloors,
    setSelectedFloorId
  } = useFloors()

  const { setAmenityTypes } = useAmenities()

  const { setUnitData } = useUnitData()

  const [mallName, setMallName] = useState<string>(() => loadAppData().mallName)

  const [showFloorPlanImage, setShowFloorPlanImage] = useState<boolean>(true)

  const [unitLabelFontSize, setUnitLabelFontSize] = useState<number>(
    DEFAULT_APP_DATA.unitLabelFontSize
  )

  const [pointRadius, setPointRadius] = useState<number>(
    DEFAULT_APP_DATA.pointRadius
  )

  const [showUnit, setShowUnit] = useState<boolean>(true)

  const [showUnitOutline, setShowUnitOutline] = useState<boolean>(true)

  const [showPaths, setShowPaths] = useState<boolean>(true)

  const [showAmenities, setShowAmenities] = useState<boolean>(true)

  const [showEntrances, setShowEntrances] = useState<boolean>(true)

  const handleToggleShowFloorPlanImage = () => {
    setShowFloorPlanImage(prev => !prev)
  }

  const handleToggleShowUnit = () => {
    setShowUnit(prev => !prev)
  }

  const handleToggleShowOutline = () => {
    setShowUnitOutline(prev => !prev)
  }

  const handleToggleShowPaths = () => {
    setShowPaths(prev => !prev)
  }

  const handleToggleShowAmenities = () => {
    setShowAmenities(prev => !prev)
  }

  const handleToggleShowEntrances = () => {
    setShowEntrances(prev => !prev)
  }

  const handleUnitLabelFontSizeChange = (size: number) => {
    setUnitLabelFontSize(size)
  }

  const handlePointRadiusChange = (radius: number) => {
    setPointRadius(radius)
  }

  const handleFloorPlanImageChange = async (file: File | string | null) => {
    if (!selectedFloor) return

    if (!file) {
      updateFloor(selectedFloor.id, {
        floorPlanImage: null
      })

      return
    }

    if (typeof file === 'string') {
      updateFloor(selectedFloor.id, {
        floorPlanImage: file
      })

      return
    }

    // Convert File to base64
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result as string

      if (selectedFloor) {
        updateFloor(selectedFloor.id, {
          floorPlanImage: base64String
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCreateFloor = (floorId: string, floorName: string) => {
    addFloor({
      id: floorId,
      name: floorName,
      floorPlanImage: null,
      units: [],
      buildingOutlines: [],
      buildingOutlineCircles: [],
      amenities: [],
      pathNodes: []
    })
    setSelectedFloorId(floorId)
  }

  const handleExport = () => {
    exportMallData()
  }

  const handleImport = () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]

      if (!file) return

      importMallData(
        file,
        data => {
          // Update all app data
          setMallName(data.mallName)
          setFloors(data.floors)

          if (data.unitLabelFontSize !== undefined) {
            setUnitLabelFontSize(data.unitLabelFontSize)
          }

          if (data.pointRadius !== undefined) {
            setPointRadius(data.pointRadius)
          }

          if (data.amenityTypes) {
            setAmenityTypes(data.amenityTypes)
          }

          if (data.unitData) {
            setUnitData(data.unitData)
          }

          // Select first floor if available
          if (data.floors.length > 0) {
            setSelectedFloorId(data.floors[0].id)
          }

          clearDrawing()
        },
        error => {
          alert(`Import failed: ${error}`)
        }
      )
    }

    input.click()
  }

  const handleClearAllData = () => {
    // Reset mall name to default
    setMallName(DEFAULT_APP_DATA.mallName)

    // Reset to default floors
    setFloors(DEFAULT_APP_DATA.floors)

    // Select the default floor
    setSelectedFloorId(DEFAULT_APP_DATA.selectedFloorId || 'G')

    // Reset font size
    setUnitLabelFontSize(DEFAULT_APP_DATA.unitLabelFontSize)

    // Reset point radius
    setPointRadius(DEFAULT_APP_DATA.pointRadius)

    // Reset amenity types
    setAmenityTypes(DEFAULT_APP_DATA.amenityTypes)

    // Reset unit data
    setUnitData(DEFAULT_APP_DATA.unitData)

    clearDrawing()
  }

  const handleFloorNameChange = (name: string) => {
    if (!selectedFloor) return

    updateFloor(selectedFloor.id, { name })
  }

  const handleFloorIdChange = (newId: string) => {
    if (!selectedFloor || newId === selectedFloor.id) return

    // Check if the new ID already exists
    const idExists = floors.some(
      f => f.id === newId && f.id !== selectedFloor.id
    )

    if (idExists) {
      return // Don't allow duplicate IDs
    }

    // Create a new floor with the new ID and remove the old one
    const updatedFloor = { ...selectedFloor, id: newId }

    const updatedFloors = floors.map(f =>
      f.id === selectedFloor.id ? updatedFloor : f
    )

    // Update the floors state and selected floor ID
    setFloors(updatedFloors)
    setSelectedFloorId(newId)
  }

  useEffect(() => {
    const savedFontSize = localStorage.getItem('unitLabelFontSize')

    if (savedFontSize) {
      setUnitLabelFontSize(Number(savedFontSize))
    }

    const savedPointRadius = localStorage.getItem('pointRadius')

    if (savedPointRadius) {
      setPointRadius(Number(savedPointRadius))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('unitLabelFontSize', String(unitLabelFontSize))
  }, [unitLabelFontSize])

  useEffect(() => {
    localStorage.setItem('pointRadius', String(pointRadius))
  }, [pointRadius])

  useEffect(() => {
    updateAppData({ mallName })
  }, [mallName])

  return (
    <SettingsContext
      value={{
        mallName,
        showFloorPlanImage,
        unitLabelFontSize,
        pointRadius,
        showUnit,
        showUnitOutline,
        showPaths,
        showAmenities,
        showEntrances,
        setMallName,
        handleFloorPlanImageChange,
        handleCreateFloor,
        handleExport,
        handleImport,
        handleClearAllData,
        handleFloorNameChange,
        handleFloorIdChange,
        handleToggleShowFloorPlanImage,
        handleUnitLabelFontSizeChange,
        handlePointRadiusChange,
        handleToggleShowUnit,
        handleToggleShowOutline,
        handleToggleShowPaths,
        handleToggleShowAmenities,
        handleToggleShowEntrances
      }}
    >
      {children}
    </SettingsContext>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }

  return context
}

export default SettingsProvider
