import type { Node } from '@xyflow/react'

export function getAbsolutePosition(nodes: Node[], node: Node) {
  let x = 0
  let y = 0
  let host: Node | undefined = node

  while (host) {
    x += host.position.x
    y += host.position.y

    host = host.parentId ? nodes.find(c => c.id === host!.parentId) : undefined
  }

  return { x, y }
}

export function getNodeBounds(nodes: Node[]) {
  const minX = Math.min(...nodes.map(node => node.position.x))
  const minY = Math.min(...nodes.map(node => node.position.y))
  const maxX = Math.max(
    ...nodes.map(
      node =>
        node.position.x +
        (() => {
          const element = document.querySelector(`[data-id="${node.id}"]`)
          return element ? element.clientWidth : 0
        })()
    )
  )
  const maxY = Math.max(
    ...nodes.map(
      node =>
        node.position.y +
        (() => {
          const element = document.querySelector(`[data-id="${node.id}"]`)
          return element ? element.clientHeight : 0
        })()
    )
  )

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}
