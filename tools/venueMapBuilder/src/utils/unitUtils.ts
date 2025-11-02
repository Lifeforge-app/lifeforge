import { ALIGNMENT_THRESHOLD } from '../constants'
import {
  type CoordinateWithSnapInfo,
  type Outline,
  type OutlineCircle,
  type Unit
} from '../types'

/**
 * Generate a new unique unit ID
 */
export function generateUnitId(): string {
  return Date.now().toString()
}

/**
 * Creates a new unit with default values
 */
export function createNewUnit(floorAbbr: string): Unit {
  return {
    id: generateUnitId(),
    name: floorAbbr + '0',
    coordinates: []
  }
}

/**
 * Creates a new building outline with default values
 */
export function createNewOutline(): Outline {
  return {
    id: crypto.randomUUID(),
    name: 'Outline',
    segments: [],
    color: '#374151',
    strokeWidth: 2
  }
}

/**
 * Creates a new building outline circle with default values
 */
export function createNewOutlineCircle(): OutlineCircle {
  return {
    id: crypto.randomUUID(),
    name: 'Circle',
    center: [0, 0],
    radius: 50,
    color: '#374151',
    strokeWidth: 2
  }
}

/**
 * Aligns coordinates that are within a threshold of each other
 * Snapped coordinates take priority in alignment
 */
export function alignCoordinates(
  coords: [number, number][],
  coordsWithSnapInfo?: CoordinateWithSnapInfo[]
): [number, number][] {
  const alignedCoords = JSON.parse(JSON.stringify(coords)) as [number, number][]

  // Get snapped coordinates - these take priority
  const snappedCoords = coordsWithSnapInfo
    ? coordsWithSnapInfo.filter(c => c.isSnapped).map(c => c.coords)
    : []

  // Collect all unique X and Y values
  const allX = [...new Set(alignedCoords.map(c => c[0]))]

  const allY = [...new Set(alignedCoords.map(c => c[1]))]

  // Create alignment groups for X coordinates
  const xGroups: number[][] = []

  allX.forEach(x => {
    const group = allX.filter(
      otherX => Math.abs(x - otherX) <= ALIGNMENT_THRESHOLD
    )

    if (group.length > 1) {
      xGroups.push(group)
    }
  })

  // Create alignment groups for Y coordinates
  const yGroups: number[][] = []

  allY.forEach(y => {
    const group = allY.filter(
      otherY => Math.abs(y - otherY) <= ALIGNMENT_THRESHOLD
    )

    if (group.length > 1) {
      yGroups.push(group)
    }
  })

  // Remove duplicate groups and calculate average for each group
  const uniqueXGroups = Array.from(
    new Set(xGroups.map(g => JSON.stringify([...g].sort())))
  ).map(g => JSON.parse(g) as number[])

  const uniqueYGroups = Array.from(
    new Set(yGroups.map(g => JSON.stringify([...g].sort())))
  ).map(g => JSON.parse(g) as number[])

  // Create alignment map for X
  const xAlignMap = new Map<number, number>()

  uniqueXGroups.forEach(group => {
    // Check if any value in this group is a snapped coordinate
    const snappedX = snappedCoords.find(sc =>
      group.some(gVal => Math.abs(gVal - sc[0]) <= ALIGNMENT_THRESHOLD)
    )?.[0]

    const avg =
      snappedX ??
      Math.round(group.reduce((sum, val) => sum + val, 0) / group.length)

    group.forEach(val => xAlignMap.set(val, avg))
  })

  // Create alignment map for Y
  const yAlignMap = new Map<number, number>()

  uniqueYGroups.forEach(group => {
    // Check if any value in this group is a snapped coordinate
    const snappedY = snappedCoords.find(sc =>
      group.some(gVal => Math.abs(gVal - sc[1]) <= ALIGNMENT_THRESHOLD)
    )?.[1]

    const avg =
      snappedY ??
      Math.round(group.reduce((sum, val) => sum + val, 0) / group.length)

    group.forEach(val => yAlignMap.set(val, avg))
  })

  // Apply alignment
  return alignedCoords.map(([x, y]) => [
    xAlignMap.get(x) ?? x,
    yAlignMap.get(y) ?? y
  ]) as [number, number][]
}

/**
 * Calculate the center point of a polygon
 */
export function calculateCenter(
  coordinates: [number, number][]
): [number, number] {
  if (coordinates.length === 0) return [0, 0]

  const centerX =
    coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length

  const centerY =
    coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length

  return [centerX, centerY]
}

/**
 * Find the closest point on a line segment to a given point
 */
function closestPointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number] {
  const dx = x2 - x1

  const dy = y2 - y1

  if (dx === 0 && dy === 0) {
    return [x1, y1]
  }

  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
  )

  return [x1 + t * dx, y1 + t * dy]
}

/**
 * Find the closest point on a polygon outline to a given point
 */
export function closestPointOnPolygon(
  point: [number, number],
  polygon: [number, number][]
): [number, number] {
  if (polygon.length < 2) return polygon[0] || [0, 0]

  let closestPoint: [number, number] = polygon[0]

  let minDistance = Infinity

  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i]

    const p2 = polygon[(i + 1) % polygon.length]

    const candidate = closestPointOnSegment(
      point[0],
      point[1],
      p1[0],
      p1[1],
      p2[0],
      p2[1]
    )

    const distance = Math.sqrt(
      Math.pow(candidate[0] - point[0], 2) +
        Math.pow(candidate[1] - point[1], 2)
    )

    if (distance < minDistance) {
      minDistance = distance
      closestPoint = candidate
    }
  }

  return [Math.round(closestPoint[0]), Math.round(closestPoint[1])]
}
