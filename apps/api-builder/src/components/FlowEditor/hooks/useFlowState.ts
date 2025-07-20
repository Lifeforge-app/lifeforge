import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow
} from '@xyflow/react'
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodeDrag
} from '@xyflow/react'
import { type MouseEvent, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import NODE_CONFIG, { type NODE_TYPES } from '../nodes'
import { getAbsolutePosition, getNodeBounds } from '../utils/getNodeBounds'

export interface FlowState {
  nodes: Node[]
  edges: Edge[]
  nodeData: Record<string, any>
}

export interface FlowStateActions {
  onNodesChange: (changes: NodeChange[]) => void
  onNodeDrag: OnNodeDrag<Node>
  onNodeDragStop: OnNodeDrag<Node>
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (params: Connection) => void
  onAddNode: (
    type: NODE_TYPES | 'group',
    position: { x: number; y: number },
    size?: { width: number; height: number }
  ) => string
  getNodeData: <T extends Record<string, any>>(id: string) => T
  updateNodeData: <T extends Record<string, any>>(
    id: string,
    data: T | ((prevData: T) => T)
  ) => void
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  setNodeData: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export function useFlowState(): FlowState & FlowStateActions {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [nodeData, setNodeData] = useState<Record<string, any>>({})
  const { getIntersectingNodes } = useReactFlow()

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  )

  const onNodeDrag = useCallback(
    (_event: MouseEvent, node: Node) => {
      const intersectingNodes = getIntersectingNodes(node)
      if (node.type === 'group') {
        setNodes(nds =>
          nds.map(n => ({
            ...n,
            className: n.id === node.id ? '' : n.className
          }))
        )
        return
      }

      const groupIntersected = intersectingNodes.find(
        n => n.type === 'group' && !node.parentId
      )

      setNodes(nds =>
        nds.map(n => {
          if (n.id === groupIntersected?.id) {
            return {
              ...n,
              className: 'group-highlight'
            }
          }

          return {
            ...n,
            className: ''
          }
        })
      )
    },
    [getIntersectingNodes]
  )

  const onNodeDragStop = useCallback(
    (_event: MouseEvent, node: Node) => {
      const intersectingNodes = getIntersectingNodes(node)
      if (node.type === 'group' || node.parentId) {
        return
      }

      const groupIntersected = intersectingNodes.find(
        n => n.type === 'group' && node.parentId !== n.id
      )

      if (groupIntersected) {
        const groupChildren = [
          ...nodes
            .filter(n => n.parentId === groupIntersected.id)
            .map(n => ({
              ...n,
              position: getAbsolutePosition(nodes, n)
            })),
          node
        ]

        const { x, y, width, height } = getNodeBounds(groupChildren)

        setNodes(nds =>
          nds.map(n => {
            if (n.id === node.id) {
              return {
                ...n,
                position: {
                  x: n.position.x - groupIntersected.position.x,
                  y: n.position.y - groupIntersected.position.y
                },
                parentId: groupIntersected.id,
                extent: 'parent'
              }
            }

            if (n.id === groupIntersected.id) {
              return {
                ...n,
                position: {
                  x: Math.round(x / 20) * 20,
                  y: Math.round(y / 20) * 20
                },
                width: Math.round(width / 20) * 20,
                height: Math.round(height / 20) * 20,
                className: ''
              }
            }

            return n
          })
        )
        return
      }
    },
    [getIntersectingNodes, nodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge(params, eds))
  }, [])

  const onAddNode = useCallback(
    (
      type: NODE_TYPES | 'group',
      position: { x: number; y: number },
      size?: { width: number; height: number }
    ) => {
      if (type === 'group') {
        const newNode: Node = {
          id: `group-${uuidv4()}`,
          type: 'group',
          position,
          data: {},
          width: size?.width || 200,
          height: size?.height || 100
        }

        setNodes(nds => nds.concat(newNode))
        return newNode.id
      }

      const data = 'data' in NODE_CONFIG[type] ? NODE_CONFIG[type].data : {}

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: {}
      }

      setNodes(nds => nds.concat(newNode))
      setNodeData(prevData => ({
        ...prevData,
        [newNode.id]: data
      }))

      return newNode.id
    },
    []
  )

  const getNodeData = useCallback(
    <T extends Record<string, any>>(id: string): T => {
      return nodeData[id] || ({} as T)
    },
    [nodeData]
  )

  const updateNodeData = useCallback(
    <T extends Record<string, any>>(
      id: string,
      data: T | ((prevData: T) => T)
    ): void => {
      if (typeof data === 'function') {
        setNodeData(prevData => ({
          ...prevData,
          [id]: {
            ...(prevData[id] ?? {}),
            ...data(prevData[id])
          }
        }))
        return
      }

      setNodeData(prevData => ({
        ...prevData,
        [id]: {
          ...(prevData[id] ?? {}),
          ...data
        }
      }))
    },
    []
  )

  return {
    nodes,
    edges,
    nodeData,
    onNodesChange,
    onNodeDrag,
    onNodeDragStop,
    onEdgesChange,
    onConnect,
    onAddNode,
    getNodeData,
    updateNodeData,
    setNodes,
    setEdges,
    setNodeData
  }
}
