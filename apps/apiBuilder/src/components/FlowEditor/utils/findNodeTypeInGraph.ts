import { type Edge, type Node, getIncomers, getOutgoers } from '@xyflow/react'

import NODE_CONFIG from '../nodes'
// 你自己定义的 NODE_CONFIG
import type { NODE_TYPES } from '../nodes'
import type { IHandler } from '../typescript/node'

export function findNodeTypeInGraph(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string,
  targetType: string,
  useWayToController = false
): Node | null {
  const startNode = nodes.find(node => node.id === startNodeId)

  if (!startNode) return null

  if (startNode.type === targetType) return startNode

  const visited = new Set<string>()

  const queue: Node[] = [startNode]

  visited.add(startNode.id)

  while (queue.length > 0) {
    const current = queue.shift()!

    const neighbors = [
      ...getIncomers(current, nodes, edges),
      ...getOutgoers(current, nodes, edges)
    ]

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.id)) continue

      const connections = edges.filter(
        edge =>
          (edge.source === current.id && edge.target === neighbor.id) ||
          (edge.target === current.id && edge.source === neighbor.id)
      )

      const hasValidConnection = connections.some(edge => {
        const fromNode = nodes.find(n => n.id === edge.source)

        const toNode = nodes.find(n => n.id === edge.target)

        if (!fromNode || !toNode) return false

        const fromHandlers =
          NODE_CONFIG[fromNode.type as NODE_TYPES]?.handlers ?? {}

        const toHandlers =
          NODE_CONFIG[toNode.type as NODE_TYPES]?.handlers ?? {}

        const fromHandler = edge.sourceHandle
          ? (fromHandlers[
              edge.sourceHandle.split('||')[0] as keyof typeof fromHandlers
            ] as IHandler)
          : undefined

        const toHandler = edge.targetHandle
          ? (toHandlers[
              edge.targetHandle.split('||')[0] as keyof typeof toHandlers
            ] as IHandler)
          : undefined

        if (!useWayToController) {
          return true
        }

        return (
          (fromHandler?.isWayToController ?? false) &&
          (toHandler?.isWayToController ?? false)
        )
      })

      if (!hasValidConnection) continue

      visited.add(neighbor.id)

      if (neighbor.type === targetType) {
        return neighbor
      }

      queue.push(neighbor)
    }
  }

  return null
}
