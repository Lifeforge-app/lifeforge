export type Coordinate = [number, number]

export interface Unit {
  id: string
  name: string
  coordinates: Coordinate[]
  labelOffsetX?: number
  labelOffsetY?: number
  entranceLocation?: Coordinate
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

export interface AmenityType {
  id: string
  name: string
  icon: string // Iconify icon name
}

export interface Amenity {
  id: string
  amenityTypeId: string
  coordinate: Coordinate
}

export interface PathNode {
  id: string
  coordinate: Coordinate
  connectedNodeIds: string[] // IDs of nodes this node connects to
}

export interface Floor {
  id: string // Floor abbreviation (e.g., 'G', 'L1', 'B')
  name: string // Full floor name (e.g., 'Ground Floor')
  floorPlanImage: string | null // Base64 or URL
  units: Unit[]
  buildingOutlines: Outline[]
  buildingOutlineCircles: OutlineCircle[]
  amenities: Amenity[]
  pathNodes: PathNode[]
}

export interface MallData {
  mallName: string
  floors: Floor[]
  amenityTypes: AmenityType[]
  unitData: UnitDataEntry[]
}

export interface UnitDataEntry {
  name: string
  unit: string
  desc: string
  logoUrl: string
}

export interface CoordinateWithSnapInfo {
  coords: Coordinate
  isSnapped: boolean
}

export type HighlightedCoord =
  | {
      type: 'unit'
      elementId: string
      index: number
    }
  | {
      type: 'outline'
      elementId: string
      index: number
    }

export interface ImageDimensions {
  width: number
  height: number
}

export type DrawingMode =
  | 'units'
  | 'outline'
  | 'outline-circle'
  | 'amenity'
  | 'path'
