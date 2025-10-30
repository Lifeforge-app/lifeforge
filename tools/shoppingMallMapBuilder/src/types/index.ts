export type Coordinate = [number, number]

export interface Unit {
  id: string
  name: string
  coordinates: Coordinate[]
}

export interface Outline {
  id: string
  name: string
  segments: Coordinate[] // Line segments for building structure
  color?: string
  strokeWidth?: number
}

export interface OutlineCircle {
  id: string
  name: string
  center: Coordinate
  radius: number
  color?: string
  strokeWidth?: number
}

export interface Floor {
  id: string // Floor abbreviation (e.g., 'G', 'L1', 'B')
  name: string // Full floor name (e.g., 'Ground Floor')
  floorPlanImage: string | null // Base64 or URL
  units: Unit[]
  buildingOutlines: Outline[]
  buildingOutlineCircles: OutlineCircle[]
}

export interface MallData {
  mallName: string
  floors: Floor[]
}

export interface CoordinateWithSnapInfo {
  coords: Coordinate
  isSnapped: boolean
}

export interface HighlightedCoord {
  unitId: string
  index: number
}

export interface ImageDimensions {
  width: number
  height: number
}

export type DrawingMode = 'units' | 'outline' | 'outline-circle'
