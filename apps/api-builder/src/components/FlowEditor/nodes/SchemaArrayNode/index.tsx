import { useNodeConnections } from '@xyflow/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { type ISchemaField } from '../SchemaNode/types'

function SchemaArrayNode({ id }: { id: string }) {
  const { t } = useTranslation('core.apiBuilder')
  const connections = useNodeConnections()
  const { getNodeData } = useFlowStateContext()
  const schemaInputConnections = connections.filter(
    connection =>
      connection.targetHandle === 'schema-input' && connection.target === id
  )
  const schemaInputData = useMemo(() => {
    if (schemaInputConnections.length === 0) return null
    const inputSchemaNodeId = schemaInputConnections[0].source
    return getNodeData<ISchemaField>(inputSchemaNodeId)
  }, [schemaInputConnections, getNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn nodeType="schemaArray" handle="schema-input">
        {schemaInputData?.name ? (
          <NodeColumnValueWrapper>
            {schemaInputData.name}
          </NodeColumnValueWrapper>
        ) : (
          <p className="text-bg-500 text-center">
            {t('empty.noSchemaConnected')}
          </p>
        )}
      </NodeColumn>
      <NodeColumn nodeType="schemaArray" handle="schema-output" />
    </NodeColumnWrapper>
  )
}

export default SchemaArrayNode
