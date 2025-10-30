import type { Coordinate, PathNode, Unit } from '../types'

interface PathResult {
  path: Coordinate[]
  distance: number
}

/**
 * Calculate Euclidean distance between two coordinates
 */
function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  return Math.sqrt(
    Math.pow(coord2[0] - coord1[0], 2) + Math.pow(coord2[1] - coord1[1], 2)
  )
}

/**
 * Find the shortest path between two units using Dijkstra's algorithm
 * @param fromUnit Starting unit (must have entranceLocation)
 * @param toUnit Target unit (must have entranceLocation)
 * @param pathNodes Array of path nodes on the floor
 * @param units All units on the floor (for entrance locations)
 * @returns Path result with coordinates and total distance, or null if no path found
 */
export function findShortestPath(
  fromUnit: Unit,
  toUnit: Unit,
  pathNodes: PathNode[]
): PathResult | null {
  if (!fromUnit.entranceLocation || !toUnit.entranceLocation) {
    return null
  }

  // Create a map of node IDs to nodes for quick lookup
  const nodeMap = new Map<string, PathNode>()

  pathNodes.forEach(node => {
    nodeMap.set(node.id, node)
  })

  // Add virtual nodes for unit entrances
  const startNodeId = `entrance-${fromUnit.id}`

  const endNodeId = `entrance-${toUnit.id}`

  // Find nearest path nodes to connect entrances to
  const startNode: PathNode = {
    id: startNodeId,
    coordinate: fromUnit.entranceLocation,
    connectedNodeIds: findNearestNodes(fromUnit.entranceLocation, pathNodes, 3)
  }

  const endNode: PathNode = {
    id: endNodeId,
    coordinate: toUnit.entranceLocation,
    connectedNodeIds: findNearestNodes(toUnit.entranceLocation, pathNodes, 3)
  }

  nodeMap.set(startNodeId, startNode)
  nodeMap.set(endNodeId, endNode)

  // Also connect path nodes to the end node if they're close
  pathNodes.forEach(node => {
    const distToEnd = calculateDistance(
      node.coordinate,
      toUnit.entranceLocation!
    )

    if (distToEnd < 100) {
      // Within 100 units
      node.connectedNodeIds.push(endNodeId)
    }
  })

  // Run Dijkstra's algorithm
  const distances = new Map<string, number>()

  const previous = new Map<string, string | null>()

  const unvisited = new Set<string>()

  // Initialize
  nodeMap.forEach((_, id) => {
    distances.set(id, id === startNodeId ? 0 : Infinity)
    previous.set(id, null)
    unvisited.add(id)
  })

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentId: string | null = null

    let minDistance = Infinity

    unvisited.forEach(id => {
      const dist = distances.get(id)!

      if (dist < minDistance) {
        minDistance = dist
        currentId = id
      }
    })

    if (currentId === null || minDistance === Infinity) {
      break // No path exists
    }

    // Reached destination
    if (currentId === endNodeId) {
      break
    }

    unvisited.delete(currentId)

    const currentNode = nodeMap.get(currentId)!

    const currentDistance = distances.get(currentId)!

    // Check all neighbors
    currentNode.connectedNodeIds.forEach(neighborId => {
      if (!unvisited.has(neighborId)) return

      const neighborNode = nodeMap.get(neighborId)

      if (!neighborNode) return

      const edgeDistance = calculateDistance(
        currentNode.coordinate,
        neighborNode.coordinate
      )

      const newDistance = currentDistance + edgeDistance

      if (newDistance < distances.get(neighborId)!) {
        distances.set(neighborId, newDistance)
        previous.set(neighborId, currentId)
      }
    })
  }

  // Reconstruct path
  if (previous.get(endNodeId) === null && startNodeId !== endNodeId) {
    return null // No path found
  }

  const path: Coordinate[] = []

  let current: string | null = endNodeId

  while (current !== null) {
    const node = nodeMap.get(current)

    if (node) {
      path.unshift(node.coordinate)
    }
    current = previous.get(current) || null
  }

  return {
    path,
    distance: distances.get(endNodeId) || 0
  }
}

/**
 * Find the N nearest path nodes to a coordinate
 */
function findNearestNodes(
  coordinate: Coordinate,
  pathNodes: PathNode[],
  count: number
): string[] {
  const distances = pathNodes.map(node => ({
    id: node.id,
    distance: calculateDistance(coordinate, node.coordinate)
  }))

  distances.sort((a, b) => a.distance - b.distance)

  return distances.slice(0, count).map(d => d.id)
}
