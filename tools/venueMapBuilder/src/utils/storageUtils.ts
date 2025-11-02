import { APP_STORAGE_KEY } from '../constants'
import { type AmenityType, type Floor, type UnitDataEntry } from '../types'

export interface AppData {
  mallName: string
  floors: Floor[]
  selectedFloorId: string | null
  unitLabelFontSize: number
  pointRadius: number
  amenityTypes: AmenityType[]
  unitData: UnitDataEntry[]
}

export const DEFAULT_APP_DATA: AppData = {
  mallName: 'Unnamed Mall',
  floors: [
    {
      id: 'G',
      name: 'Ground Floor',
      floorPlanImage: null,
      units: [],
      buildingOutlines: [],
      buildingOutlineCircles: [],
      amenities: [],
      pathNodes: []
    }
  ],
  selectedFloorId: 'G',
  unitLabelFontSize: 4,
  pointRadius: 4,
  amenityTypes: [
    { id: 'toilet', name: 'Toilet', icon: 'tabler:toilet-paper' },
    { id: 'parking', name: 'Parking', icon: 'tabler:parking' },
    { id: 'elevator', name: 'Elevator', icon: 'tabler:elevator' },
    { id: 'stairs', name: 'Stairs', icon: 'tabler:stairs' },
    { id: 'atm', name: 'ATM', icon: 'tabler:cash' },
    { id: 'info', name: 'Information', icon: 'tabler:info-circle' }
  ],
  unitData: []
}

/**
 * Load all app data from localStorage
 */
export function loadAppData(): AppData {
  const stored = localStorage.getItem(APP_STORAGE_KEY)

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<AppData>

      // Merge with defaults to handle new fields in updates
      return {
        ...DEFAULT_APP_DATA,
        ...parsed
      }
    } catch {
      return DEFAULT_APP_DATA
    }
  }

  return DEFAULT_APP_DATA
}

/**
 * Save all app data to localStorage
 */
export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)

    // If quota exceeded, try to save without floor plan images
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.warn('LocalStorage quota exceeded. Removing floor plan images...')

      const dataWithoutImages = {
        ...data,
        floors: data.floors.map(floor => ({
          ...floor,
          floorPlanImage: null
        }))
      }

      try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(dataWithoutImages))
        console.warn('Saved without floor plan images due to quota limit')
      } catch {
        console.error('Failed to save even without images')
      }
    }
  }
}

/**
 * Update specific fields in app data
 */
export function updateAppData(updates: Partial<AppData>): void {
  const data = loadAppData()

  saveAppData({ ...data, ...updates })
}
