import { useEdges, useNodeId, useNodes } from '@xyflow/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowStateContext } from '../../../hooks/useFlowStateContext'
import { traverseGraph } from '../../../utils/traverseGraph'
import FieldColumn from '../../SchemaNode/components/FieldColumn'
import type { IValueFromRequestNodeData } from '../../ValueFromRequestNode/types'

function FieldValueColumn({ fieldId }: { fieldId: string }) {
  const { t } = useTranslation('core.apiBuilder')
  const nodes = useNodes()
  const edges = useEdges()
  const nodeId = useNodeId()
  const { getNodeData } = useFlowStateContext()

  const targetValueNode = useMemo(() => {
    const targetNode = traverseGraph(nodes, edges, nodeId!, [
      { dir: 'in', id: `field-value-input||${fieldId}` }
    ])
    return targetNode
  }, [nodes, edges, nodeId, fieldId])

  const targetValueData = useMemo(() => {
    if (!targetValueNode) return null

    if (targetValueNode.type === 'valueFromRequest') {
      return getNodeData<IValueFromRequestNodeData>(targetValueNode.id)
    }

    if (targetValueNode.type === 'value') {
      //TODO
    }

    return null
  }, [targetValueNode, getNodeData])

  if (!targetValueNode) {
    return <></>
  }

  if (targetValueNode.type === 'valueFromRequest') {
    if (!targetValueData || !targetValueData.field) {
      return (
        <p className="text-bg-500 text-center">{t('empty.noFieldSelected')}</p>
      )
    }

    return (
      <FieldColumn
        field={targetValueData.field}
        rightComponent={
          <span className="text-bg-500 text-sm">
            ({targetValueData.requestType})
          </span>
        }
      />
    )
  }
}

export default FieldValueColumn
