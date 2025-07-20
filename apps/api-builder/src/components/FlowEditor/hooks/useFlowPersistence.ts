import { type Node } from '@xyflow/react'
import { useEffect } from 'react'

import { useFlowStateContext } from './useFlowStateContext'

const STORAGE_KEY = 'flowData'

export function useFlowPersistence() {
  const { setNodes, setEdges, setNodeData } = useFlowStateContext()

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (savedData) {
      try {
        const flowData = JSON.parse(savedData)

        if (flowData.nodes && flowData.edges) {
          setNodes(
            flowData.nodes
              .map((node: Node) => ({
                ...node
              }))
              .sort((a: Node, b: Node) => {
                if (a.type === 'group' && b.type !== 'group') return -1
                if (b.type === 'group' && a.type !== 'group') return 1

                return a.id.localeCompare(b.id)
              })
          )
          setNodeData(flowData.nodeData || {})
          setEdges(flowData.edges)
        }
      } catch (error) {
        console.error('Failed to parse saved flow data:', error)
      }
    }
  }, [setNodes, setEdges, setNodeData])
}
