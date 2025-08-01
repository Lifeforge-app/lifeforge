import { useEdges, useNodes } from '@xyflow/react'
import { useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeListbox from '../../components/Node/NodeListbox'
import NodeListboxOption from '../../components/Node/NodeListboxOption'
import NodeTextInput from '../../components/Node/NodeTextInput'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type { IRouterNodeData } from '../RouterNode/types'
import METHOD_COLORS from './constants/method_colors'
import type { IRouteNodeData } from './types'

function RouteNode({ id }: { id: string }) {
  const nodes = useNodes()

  const edges = useEdges()

  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { method, path } = useMemo(
    () => getNodeData<IRouteNodeData>(id),
    [getNodeData, id]
  )

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

  useMemo(() => {
    updateNodeData(id, { parentPath })
  }, [id, parentPath, updateNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn handle="router-input" nodeType="route">
        {parentPath && (
          <NodeColumnValueWrapper>{parentPath}</NodeColumnValueWrapper>
        )}
      </NodeColumn>
      <NodeColumn label="HTTP Method">
        <NodeListbox
          buttonContent={
            <span className="text-bg-500 flex items-center gap-2 font-medium">
              <span
                className="size-2 rounded-full"
                style={{
                  backgroundColor: METHOD_COLORS[method]?.[500] || '#ccc'
                }}
              />
              {method}
            </span>
          }
          setValue={value =>
            updateNodeData(id, { method: value as typeof method })
          }
          value={method}
        >
          {Object.entries(METHOD_COLORS).map(([m, color]) => (
            <NodeListboxOption key={m} isSelected={m === method} value={m}>
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: color[500] || '#ccc'
                  }}
                />
                {m}
              </div>
            </NodeListboxOption>
          ))}
        </NodeListbox>
      </NodeColumn>
      <NodeColumn label="Route Path">
        <NodeTextInput
          placeholder="/route/path"
          setValue={newValue => {
            updateNodeData(id, { path: newValue })
          }}
          value={path}
        />
      </NodeColumn>
      <NodeColumn handle="route-output" nodeType="route" />
    </NodeColumnWrapper>
  )
}

export default RouteNode
