import { useEdges, useNodes } from '@xyflow/react'
import { useEffect, useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeTextInput from '../../components/Node/NodeTextInput'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type { IRouterNodeData } from './types'

function RouterNode({ id }: { id: string }) {
  const nodes = useNodes()

  const edges = useEdges()

  const { getNodeData, updateNodeData } = useFlowStateContext()

  const parentRouterNode = useMemo(
    () => traverseGraph(nodes, edges, id, [{ dir: 'in', id: 'router-input' }]),
    [nodes, edges, id]
  )

  const parentPath = useMemo(() => {
    if (!parentRouterNode) return ''

    const parentData = getNodeData<IRouterNodeData>(parentRouterNode.id)

    return (
      parentData.parentPath +
      (parentData.path.startsWith ? '' : '/') +
      parentData.path
    )
  }, [getNodeData, parentRouterNode])

  const { path } = useMemo(
    () => getNodeData<IRouterNodeData>(id),
    [getNodeData, id]
  )

  useEffect(() => {
    updateNodeData(id, { parentPath })
  }, [id, parentPath, updateNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn handle="router-input" nodeType="router">
        {parentPath && (
          <NodeColumnValueWrapper>{parentPath}</NodeColumnValueWrapper>
        )}
      </NodeColumn>
      <NodeColumn label="Router Path">
        <NodeTextInput
          placeholder="/route/path"
          setValue={(newValue: string) => {
            updateNodeData(id, { path: newValue })
          }}
          value={path}
        />
      </NodeColumn>
      <NodeColumn handle="router-output" nodeType="router" />
    </NodeColumnWrapper>
  )
}

export default RouterNode
