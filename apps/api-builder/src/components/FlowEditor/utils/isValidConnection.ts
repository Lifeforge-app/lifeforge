import {
  type Connection,
  type Edge,
  type Node,
  getOutgoers
} from '@xyflow/react'

import NODE_CONFIG, { type NODE_TYPES } from '../nodes'
import type { IHandler } from '../typescript/node'

const hasCycle = (
  start: Node,
  sourceId: string,
  nodes: Node[],
  edges: Edge[],
  visited = new Set<string>()
): boolean => {
  if (visited.has(start.id)) return false
  visited.add(start.id)

  for (const next of getOutgoers(start, nodes, edges)) {
    if (next.id === sourceId) return true
    if (hasCycle(next, sourceId, nodes, edges, visited)) return true
  }
  return false
}

/**
 * Validates whether a connection between two nodes is valid based on various criteria.
 *
 * @param connection - The connection or edge to validate, containing source and target information
 * @param nodes - Array of all nodes in the flow editor
 * @param edges - Array of all existing edges in the flow editor
 *
 * @returns `true` if the connection is valid, `false` otherwise
 *
 * @remarks
 * This function performs the following validation checks:
 * - Ensures both source and target handles exist
 * - Prevents self-connections (source cannot equal target)
 * - Verifies both source and target nodes exist in the nodes array
 * - Checks for cycle detection to prevent infinite loops
 * - Validates node configurations exist for both source and target nodes
 * - Ensures handlers exist for both source and target handles
 * - Enforces cardinality constraints (limits number of connections to a target)
 * - Applies handler filters to restrict allowed source handles
 * - Applies node filters to restrict allowed source node types
 */
export const isValidConnection = (
  connection: Connection | Edge,
  nodes: Node[],
  edges: Edge[]
) => {
  if (!connection.sourceHandle || !connection.targetHandle) return false
  if (connection.source === connection.target) return false

  const sourceNode = nodes.find(n => n.id === connection.source)
  const targetNode = nodes.find(n => n.id === connection.target)
  if (!sourceNode || !targetNode) return false

  if (hasCycle(targetNode, connection.source, nodes, edges)) return false

  const tgtCfg = NODE_CONFIG[targetNode.type as NODE_TYPES]
  const srcCfg = NODE_CONFIG[sourceNode.type as NODE_TYPES]
  if (!tgtCfg || !srcCfg) return false

  const tgtHandler = tgtCfg.handlers[
    connection.targetHandle.split('||')[0] as keyof typeof tgtCfg.handlers
  ] as IHandler
  const srcHandler = srcCfg.handlers[
    connection.sourceHandle.split('||')[0] as keyof typeof srcCfg.handlers
  ] as IHandler
  if (!tgtHandler || !srcHandler) return false

  if (tgtHandler.cardinality && tgtHandler.cardinality !== 'many') {
    const existing = edges.filter(
      e =>
        e.target === connection.target &&
        e.targetHandle === connection.targetHandle
    ).length
    if (existing >= tgtHandler.cardinality) return false
  }

  if (
    tgtHandler.filter?.handler &&
    !tgtHandler.filter.handler.includes(connection.sourceHandle)
  ) {
    return false
  }

  if (
    tgtHandler.filter?.node &&
    !tgtHandler.filter.node.includes(sourceNode.type as NODE_TYPES)
  ) {
    return false
  }

  return true
}
