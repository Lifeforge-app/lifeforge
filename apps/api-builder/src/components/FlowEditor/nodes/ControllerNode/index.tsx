import { useNodeConnections } from '@xyflow/react'
import { useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import METHOD_COLORS from '../RouteNode/constants/method_colors'
import type { IRouteNodeData } from '../RouteNode/types'

function ControllerNode({ id }: { id: string }) {
  const connections = useNodeConnections()
  const { getNodeData } = useFlowStateContext()
  const routeInputConnections = useMemo(
    () =>
      connections.filter(
        conn => conn.targetHandle === 'route-input' && conn.target === id
      ),
    [connections, id]
  )
  const routeInputSchemaData = useMemo(() => {
    if (routeInputConnections.length === 0) return null
    const inputSchemaNodeId = routeInputConnections[0].source
    return getNodeData<IRouteNodeData>(inputSchemaNodeId)
  }, [routeInputConnections, getNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn nodeType="controller" handle="route-input">
        {routeInputSchemaData && (
          <NodeColumnValueWrapper>
            <div className="flex w-full min-w-0 items-center gap-2">
              <span
                style={{
                  backgroundColor:
                    METHOD_COLORS[routeInputSchemaData.method][500]
                }}
                className="size-2 shrink-0 rounded-full"
              />
              <span className="text-bg-500">
                {routeInputSchemaData.method.toUpperCase()}{' '}
              </span>
              <span className="w-full min-w-0 truncate">
                {routeInputSchemaData.parentPath}
                {routeInputSchemaData.path.startsWith('/')
                  ? routeInputSchemaData.path
                  : `/${routeInputSchemaData.path}`}
              </span>
            </div>
          </NodeColumnValueWrapper>
        )}
      </NodeColumn>
      <NodeColumn nodeType="controller" handle="request-schema-input" />
      <NodeColumn nodeType="controller" handle="response-schema-input" />
      <NodeColumn nodeType="controller" handle="controller-output" />
    </NodeColumnWrapper>
  )
}

export default ControllerNode
