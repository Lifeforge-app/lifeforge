import { type AmenityType, type Floor, type UnitDataEntry } from '../types'
import { loadAppData } from './storageUtils'

export interface MallExportData {
  version: string
  mallName: string
  floors: Floor[]
  unitLabelFontSize: number
  pointRadius: number
  amenityTypes: AmenityType[]
  unitData: UnitDataEntry[]
  exportedAt: string
}

/**
 * Export mall data to JSON file
 */
export function exportMallData(): void {
  const appData = loadAppData()

  const data: MallExportData = {
    version: '1.0.0',
    mallName: appData.mallName,
    floors: appData.floors,
    unitLabelFontSize: appData.unitLabelFontSize,
    pointRadius: appData.pointRadius,
    amenityTypes: appData.amenityTypes,
    unitData: appData.unitData,
    exportedAt: new Date().toISOString()
  }

  const json = JSON.stringify(data, null, 2)

  const blob = new Blob([json], { type: 'application/json' })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')

  a.href = url

  // Create filename from mall name
  const filename = `${appData.mallName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`

  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import mall data from JSON file
 */
export function importMallData(
  file: File,
  onSuccess: (data: MallExportData) => void,
  onError: (error: string) => void
): void {
  const reader = new FileReader()

  reader.onload = e => {
    try {
      const content = e.target?.result as string

      const data = JSON.parse(content) as MallExportData

      // Validate the data structure
      if (!data.version || !data.mallName || !Array.isArray(data.floors)) {
        throw new Error('Invalid mall data format')
      }

      // Ensure backward compatibility
      if (!data.amenityTypes) {
        data.amenityTypes = []
      }

      if (!data.unitData) {
        data.unitData = []
      }

      // Validate floors structure
      for (const floor of data.floors) {
        if (
          !floor.id ||
          !floor.name ||
          !Array.isArray(floor.units) ||
          !Array.isArray(floor.buildingOutlines)
        ) {
          throw new Error('Invalid floor data structure')
        }

        // Ensure buildingOutlineCircles exists (for backwards compatibility)
        if (!floor.buildingOutlineCircles) {
          floor.buildingOutlineCircles = []
        }

        // Ensure amenities exists (for backwards compatibility)
        if (!floor.amenities) {
          floor.amenities = []
        }
      }

      onSuccess(data)
    } catch (error) {
      onError(
        error instanceof Error ? error.message : 'Failed to parse JSON file'
      )
    }
  }

  reader.onerror = () => {
    onError('Failed to read file')
  }

  reader.readAsText(file)
}
