import { type Edge, type Node, getConnectedEdges } from '@xyflow/react'

export type Direction = 'out' | 'in'

export function traverseGraph(
  nodes: Node[],
  edges: Edge[],
  startNodeId: string,
  path: {
    dir: Direction
    id: string
  }[]
): Node | null {
  let current = nodes.find(n => n.id === startNodeId)
  if (!current) return null

  for (const step of path) {
    if (!current) return null

    const connections = getConnectedEdges([current], edges)
    const targetConnection = connections.find(conn => {
      if (step.dir === 'out') {
        return conn.sourceHandle === step.id && conn.source === current!.id
      } else {
        return conn.targetHandle === step.id && conn.target === current!.id
      }
    })

    if (!targetConnection) return null

    current = nodes.find(
      (n): boolean =>
        (step.dir === 'out' && n.id === targetConnection.target) ||
        (step.dir === 'in' && n.id === targetConnection.source)
    )

    if (!current) return null
  }

  return current
}
