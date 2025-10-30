import { useState } from 'react'

import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import type { Coordinate } from '../../types'

export function usePath() {
  const [continuousPlotting, setContinuousPlotting] = useState(true)

  const {
    startDrawing,
    clearDrawingAndDeselect: clearDrawing,
    selectedElementId,
    setSelectedElementId
  } = useDrawing()

  const { selectedFloor, updateFloor } = useFloors()

  const pathNodes = selectedFloor?.pathNodes || []

  const selectedNode = pathNodes.find(n => n.id === selectedElementId)

  const handleNewNode = () => {
    if (!selectedFloor) return

    const newNode = {
      id: crypto.randomUUID(),
      coordinate: [0, 0] as [number, number],
      connectedNodeIds: []
    }

    updateFloor(selectedFloor.id, {
      pathNodes: [...selectedFloor.pathNodes, newNode]
    })
    setSelectedElementId(newNode.id)
    startDrawing()
  }

  const handleDeleteNode = () => {
    if (!selectedFloor || !selectedNode) return

    // Remove this node and all connections to it
    updateFloor(selectedFloor.id, {
      pathNodes: selectedFloor.pathNodes
        .filter(n => n.id !== selectedNode.id)
        .map(n => ({
          ...n,
          connectedNodeIds: n.connectedNodeIds.filter(
            id => id !== selectedNode.id
          )
        }))
    })
    setSelectedElementId(null)
    clearDrawing()
  }

  const handleToggleConnection = (targetNodeId: string) => {
    if (!selectedFloor || !selectedNode) return

    const isConnected = selectedNode.connectedNodeIds.includes(targetNodeId)

    updateFloor(selectedFloor.id, {
      pathNodes: selectedFloor.pathNodes.map(n => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            connectedNodeIds: isConnected
              ? n.connectedNodeIds.filter(id => id !== targetNodeId)
              : [...n.connectedNodeIds, targetNodeId]
          }
        }

        // Make connections bidirectional
        if (n.id === targetNodeId) {
          return {
            ...n,
            connectedNodeIds: isConnected
              ? n.connectedNodeIds.filter(id => id !== selectedNode.id)
              : [...n.connectedNodeIds, selectedNode.id]
          }
        }

        return n
      })
    })

    // When connecting (not disconnecting), select the target node for chaining
    if (!isConnected) {
      setSelectedElementId(targetNodeId)
    }
  }

  const handleCoordinateChange = (axis: 0 | 1, value: number) => {
    if (!selectedFloor || !selectedNode) return

    const newCoord: [number, number] = [...selectedNode.coordinate]

    newCoord[axis] = value

    updateFloor(selectedFloor.id, {
      pathNodes: selectedFloor.pathNodes.map(n =>
        n.id === selectedNode.id ? { ...n, coordinate: newCoord } : n
      )
    })
  }

  const handleFinishDrawing = (
    newCoordinates: Coordinate[],
    shouldReset: boolean
  ) => {
    if (!selectedFloor || !selectedElementId || newCoordinates.length < 1)
      return

    // Update the current node's coordinate
    const updatedPathNodes = selectedFloor.pathNodes.map(n =>
      n.id === selectedElementId ? { ...n, coordinate: newCoordinates[0] } : n
    )

    if (shouldReset) {
      updateFloor(selectedFloor.id, {
        pathNodes: updatedPathNodes
      })
      clearDrawing()
    } else if (continuousPlotting) {
      // In continuous mode, create a new node automatically
      const newNode = {
        id: crypto.randomUUID(),
        coordinate: [0, 0] as [number, number],
        connectedNodeIds: []
      }

      // Update with both the coordinate change AND the new node
      updateFloor(selectedFloor.id, {
        pathNodes: [...updatedPathNodes, newNode]
      })
      setSelectedElementId(newNode.id)
      startDrawing()
    } else {
      // Just update the coordinate
      updateFloor(selectedFloor.id, {
        pathNodes: updatedPathNodes
      })
    }
  }

  return {
    selectedNode,
    pathNodes,
    continuousPlotting,
    setContinuousPlotting,
    handleNewNode,
    handleDeleteNode,
    handleToggleConnection,
    handleCoordinateChange,
    handleFinishDrawing
  }
}
