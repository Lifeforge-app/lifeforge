import { useNodeConnections } from '@xyflow/react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeTextInput from '../../components/Node/NodeTextInput'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import FieldsColumn from '../SchemaNode/components/FieldsColumn'
import type { ISchemaField, ISchemaNodeData } from '../SchemaNode/types'

const PB_SCHEMA: ISchemaField[] = [
  { name: 'id', type: 'string', isOptional: false },
  { name: 'collectionId', type: 'string', isOptional: false },
  { name: 'collectionName', type: 'string', isOptional: false },
  { name: 'created', type: 'string', isOptional: false },
  { name: 'updated', type: 'string', isOptional: false }
]

function WithPBNode({ id }: { id: string }) {
  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { name, fields } = useMemo(
    () => getNodeData<ISchemaNodeData>(id),
    [getNodeData, id]
  )

  const { t } = useTranslation('apps.apiBuilder')

  const connections = useNodeConnections()

  const inputConnections = useMemo(
    () =>
      connections.filter(
        conn => conn.targetHandle === 'schema-input' && conn.target === id
      ),
    [connections, id]
  )

  const inputSchemaData = useMemo(() => {
    if (inputConnections.length === 0) return null

    const inputSchemaNodeId = inputConnections[0].source

    return getNodeData<ISchemaNodeData>(inputSchemaNodeId)
  }, [inputConnections, getNodeData])

  const inputSchemaDataJSON = useMemo(() => {
    return inputSchemaData ? JSON.stringify(inputSchemaData, null, 2) : null
  }, [inputSchemaData])

  useEffect(() => {
    const inputSchemaData = JSON.parse(
      inputSchemaDataJSON || '{"fields": [], "name": ""}'
    ) as ISchemaNodeData

    if (!inputSchemaData) {
      updateNodeData(id, { fields: [], name: '' })
    } else {
      updateNodeData(id, {
        name: `${inputSchemaData.name || 'Schema'}`,
        fields: [...PB_SCHEMA, ...inputSchemaData.fields]
      })
    }
  }, [inputSchemaDataJSON, id, updateNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn handle="schema-input" nodeType="schemaWithPB">
        {inputSchemaData && <NodeTextInput disabled value={name} />}
      </NodeColumn>
      {inputSchemaData ? (
        <FieldsColumn fields={fields} />
      ) : (
        <p className="text-bg-500 text-center">
          {t('empty.noSchemaConnected')}
        </p>
      )}
      <NodeColumn handle="schema-output" nodeType="schemaWithPB" />
    </NodeColumnWrapper>
  )
}

export default WithPBNode
