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
      amenities: []
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
  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data))
}

/**
 * Update specific fields in app data
 */
export function updateAppData(updates: Partial<AppData>): void {
  const data = loadAppData()

  saveAppData({ ...data, ...updates })
}
