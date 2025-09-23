import { useNodeConnections } from '@xyflow/react'
import { useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import FieldsColumn from '../SchemaNode/components/FieldsColumn'

function RequestSchemaNode({ id }: { id: string }) {
  const connections = useNodeConnections()

  const { getNodeData } = useFlowStateContext()

  const schemaInputConnections = useMemo(
    () =>
      connections.filter(
        conn =>
          conn.targetHandle?.includes('schema-input') && conn.target === id
      ),
    [connections, id]
  )

  const schemaInputData = useMemo(() => {
    if (schemaInputConnections.length === 0) return null

    const schemaFields = {
      query: [],
      params: [],
      body: []
    }

    schemaInputConnections.forEach(conn => {
      const inputSchemaNodeId = conn.source

      const nodeData = getNodeData(inputSchemaNodeId)

      if (nodeData && nodeData.fields) {
        schemaFields[
          conn.targetHandle?.split('-')[0] as keyof typeof schemaFields
        ] = nodeData.fields
      }
    })

    return schemaFields
  }, [schemaInputConnections, getNodeData])

  return (
    <NodeColumnWrapper>
      {(['params', 'query', 'body'] as const).map(type => (
        <NodeColumn
          key={type}
          handle={`${type}-schema-input`}
          nodeType="requestSchema"
        >
          <FieldsColumn
            fields={schemaInputData?.[type] || []}
            withEmptyMessage={false}
            withLabel={false}
          />
        </NodeColumn>
      ))}
      <NodeColumn handle="request-schema-output" nodeType="requestSchema" />
    </NodeColumnWrapper>
  )
}

export default RequestSchemaNode
