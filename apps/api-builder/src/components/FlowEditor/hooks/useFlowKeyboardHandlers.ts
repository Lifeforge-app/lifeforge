import { type Node, useNodes, useReactFlow } from '@xyflow/react'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { useModalStore } from '@lifeforge/ui'

import GroupNodeConfigModal from '../components/Node/GroupNode/components/GroupNodeConfigModal'
import NodeSelector from '../components/Node/NodeSelector'
import NODE_CONFIG, { type NODE_TYPES } from '../nodes'
import { getAbsolutePosition, getNodeBounds } from '../utils/getNodeBounds'
import { useFlowStateContext } from './useFlowStateContext'

const MARGIN = 40

export function useFlowKeyboardHandlers() {
  const { onAddNode, setNodes, updateNodeData, setNodeData } =
    useFlowStateContext()
  const nodes = useNodes()
  const { screenToFlowPosition } = useReactFlow()
  const open = useModalStore(s => s.open)
  const stack = useModalStore(s => s.stack)
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const openNodeSelector = useCallback(() => {
    if (stack.length > 0) {
      return
    }

    const position = screenToFlowPosition({
      x: mousePosition.current.x,
      y: mousePosition.current.y
    })

    open(NodeSelector, {
      onSelect: (nodeType: NODE_TYPES) => {
        onAddNode(nodeType, position)
      }
    })
  }, [screenToFlowPosition, open, onAddNode, stack])

  const groupSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected && !node.parentId)

    if (selectedNodes.length === 0) {
      toast.error('No nodes selected to group.')
      return
    }

    if (selectedNodes.some(node => node.type === 'group')) {
      toast.error('You can only group nodes that are not a group themselves.')
      return
    }

    const { x, y, width, height } = getNodeBounds(selectedNodes)

    const groupNode: Node = {
      id: `group-${uuidv4()}`,
      type: 'group',
      position: {
        x: Math.round((x - MARGIN) / 20) * 20,
        y: Math.round((y - MARGIN) / 20) * 20
      },
      data: {},
      width: Math.round((width + MARGIN * 2) / 20) * 20,
      height: Math.round((height + MARGIN * 2) / 20) * 20
    }

    setNodes(nds => [
      groupNode,
      ...nds.filter(node => !node.selected),
      ...selectedNodes.map(node => ({
        ...node,
        selected: false,
        position: {
          x: node.position.x - groupNode.position.x,
          y: node.position.y - groupNode.position.y
        },
        extent: 'parent' as const,
        parentId: groupNode.id
      }))
    ])

    updateNodeData(groupNode.id, {
      name: '',
      icon: ''
    })

    open(GroupNodeConfigModal, {
      nodeId: groupNode.id
    })
  }, [nodes, setNodes, open, updateNodeData])

  const ungroupNodes = useCallback(() => {
    const selectedNodes = nodes.filter(
      node => node.selected && node.type === 'group'
    )

    if (selectedNodes.length === 0) {
      return
    }

    const toBeUngrouped = selectedNodes[0]

    setNodes(nds =>
      nds
        .filter(node => node.id !== toBeUngrouped.id)
        .map(node => {
          if (node.parentId === toBeUngrouped.id) {
            return {
              ...node,
              selected: false,
              position: {
                x: node.position.x + toBeUngrouped.position.x,
                y: node.position.y + toBeUngrouped.position.y
              },
              extent: undefined,
              parentId: undefined
            }
          }
          return node
        })
    )
  }, [nodes, setNodes])

  const duplicateSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected)
    if (selectedNodes.length === 0) {
      toast.error('No nodes selected to duplicate.')
      return
    }

    if (selectedNodes.length > 1) {
      toast.error('Cannot duplicate multiple nodes at once.')
      return
    }

    const selectedNode = selectedNodes[0]

    if (selectedNode.type === 'group') {
      toast.error('Cannot duplicate grouped nodes.')
      return
    }

    const type = selectedNode.type as NODE_TYPES

    const data = 'data' in NODE_CONFIG[type] ? NODE_CONFIG[type].data : {}

    const element = document.querySelector(
      `[data-id="${selectedNode.id}"] > div`
    )
    if (!element) {
      toast.error('Selected node not found in the DOM.')
      return
    }

    const nodeHeight = element.clientHeight

    const newNode = {
      id: uuidv4(),
      type,
      position: {
        x: selectedNode.position.x,
        y: Math.round((selectedNode.position.y + nodeHeight + 40) / 20) * 20
      },
      data: {}
    }

    setNodes(nds => nds.concat(newNode))
    setNodeData(prevData => ({
      ...prevData,
      [newNode.id]: data
    }))

    toast.success(`Node "${NODE_CONFIG[type].name}" duplicated successfully.`)
  }, [nodes, setNodes, setNodeData])

  const resizeGroupNode = useCallback(() => {
    const selectedNodes = nodes.filter(
      node => node.selected && node.type === 'group'
    )
    if (!selectedNodes.length) {
      return
    }

    for (const node of selectedNodes) {
      const children = nodes
        .filter(child => child.parentId === node.id)
        .map(child => ({
          ...child,
          position: getAbsolutePosition(nodes, child)
        }))

      if (children.length === 0) {
        continue
      }

      const { x, y, width, height } = getNodeBounds(children)

      const deltaX = x - node.position.x
      const deltaY = y - node.position.y

      setNodes(nds =>
        nds.map(n => {
          if (n.id === node.id) {
            return {
              ...n,
              position: {
                x: Math.round((x - MARGIN) / 20) * 20,
                y: Math.round((y - MARGIN) / 20) * 20
              },
              width: Math.round((width + MARGIN * 2) / 20) * 20,
              height: Math.round((height + MARGIN * 2) / 20) * 20
            }
          }

          if (children.some(child => child.id === n.id)) {
            return {
              ...n,
              position: {
                x: n.position.x - deltaX + MARGIN,
                y: n.position.y - deltaY + MARGIN
              }
            }
          }
          return n
        })
      )
    }
  }, [nodes, setNodes])

  const removeFromGroup = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected && node.parentId)

    if (selectedNodes.length === 0) {
      return
    }

    if (selectedNodes.length > 1) {
      toast.error('Cannot remove multiple nodes from a group at once.')
      return
    }

    const targetNode = selectedNodes[0]

    const parentNode = nodes.find(n => n.id === targetNode.parentId)

    if (!parentNode) {
      return
    }

    const newChildren = nodes
      .filter(n => n.parentId === parentNode.id && n.id !== targetNode.id)
      .map(n => ({
        ...n,
        position: getAbsolutePosition(nodes, n)
      }))

    const { x, y, width, height } = getNodeBounds(newChildren)
    const deltaX = x - parentNode.position.x
    const deltaY = y - parentNode.position.y

    setNodes(nds =>
      nds.map(node => {
        if (node.id === targetNode.id) {
          return {
            ...node,
            selected: false,
            position: {
              x: Math.round((x + width + MARGIN + 20) / 20) * 20,
              y: Math.round((y + height + MARGIN + 20) / 20) * 20
            },
            extent: undefined,
            parentId: undefined
          }
        }

        if (node.id === targetNode.parentId) {
          return {
            ...node,
            position: {
              x: Math.round((x - MARGIN) / 20) * 20,
              y: Math.round((y - MARGIN) / 20) * 20
            },
            width: Math.round((width + MARGIN * 2) / 20) * 20,
            height: Math.round((height + MARGIN * 2) / 20) * 20
          }
        }

        if (newChildren.some(child => child.id === node.id)) {
          return {
            ...node,
            position: {
              x: node.position.x - deltaX + MARGIN,
              y: node.position.y - deltaY + MARGIN
            }
          }
        }

        return node
      })
    )
  }, [nodes, setNodes])

  const isInputFocused = useCallback(() => {
    return (
      document.activeElement &&
      (document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA')
    )
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isInputFocused()) {
        return
      }

      if (event.key.toLowerCase() === 'a') {
        openNodeSelector()
      }

      if (event.key.toLowerCase() === 'g') {
        if (event.shiftKey) {
          ungroupNodes()
          return
        }
        groupSelectedNodes()
      }

      if (event.key.toLowerCase() === 'd') {
        duplicateSelectedNodes()
      }

      if (event.key.toLowerCase() === 'r') {
        resizeGroupNode()
      }

      if (event.key.toLowerCase() === 'x') {
        removeFromGroup()
      }
    },
    [
      isInputFocused,
      openNodeSelector,
      groupSelectedNodes,
      ungroupNodes,
      duplicateSelectedNodes,
      resizeGroupNode,
      removeFromGroup
    ]
  )

  const handleMouseMove = useCallback((event: MouseEvent) => {
    mousePosition.current = { x: event.clientX, y: event.clientY }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleKeyDown, handleMouseMove])
}
