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
      <NodeColumn handle="route-input" nodeType="controller">
        {routeInputSchemaData && (
          <NodeColumnValueWrapper>
            <div className="flex w-full min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    METHOD_COLORS[routeInputSchemaData.method][500]
                }}
              />
              <span className="text-bg-500">
                {routeInputSchemaData.method.toUpperCase()}
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
      <NodeColumn handle="request-schema-input" nodeType="controller" />
      <NodeColumn handle="response-schema-input" nodeType="controller" />
      <NodeColumn handle="controller-output" nodeType="controller" />
    </NodeColumnWrapper>
  )
}

export default ControllerNode
