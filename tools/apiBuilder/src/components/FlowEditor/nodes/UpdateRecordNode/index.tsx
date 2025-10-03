import { useEdges, useNodes } from '@xyflow/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type { ICollectionNodeData } from '../CollectionNode/types'
import FieldValueColumn from '../CreateRecordNode/components/FieldValueColumn'

function UpdateRecordNode({ id }: { id: string }) {
  const { t } = useTranslation('apps.apiBuilder')

  const { getNodeData } = useFlowStateContext()

  const nodes = useNodes()

  const edges = useEdges()

  const targetCollection = useMemo(() => {
    return traverseGraph(nodes, edges, id, [
      { dir: 'in', id: 'collection-input' }
    ])
  }, [nodes, edges, id])

  const targetFields = useMemo(() => {
    if (!targetCollection) return []

    return getNodeData<ICollectionNodeData>(targetCollection.id)?.fields ?? []
  }, [targetCollection, getNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn handle="collection-input" nodeType="updateRecord" />
      {targetCollection ? (
        targetFields.length > 0 ? (
          targetFields.map(field => (
            <NodeColumn
              key={field.name}
              dynamicId={field.name}
              handle="field-value-input"
              nodeType="updateRecord"
            >
              <FieldValueColumn fieldId={field.name} />
            </NodeColumn>
          ))
        ) : (
          <p className="text-bg-500 text-center">{t('empty.noFields')}</p>
        )
      ) : (
        <p className="text-bg-500 text-center">
          {t('empty.noCollectionConnected')}
        </p>
      )}
      <NodeColumn handle="db-operation-output" nodeType="updateRecord" />
    </NodeColumnWrapper>
  )
}

export default UpdateRecordNode
