import { Icon } from '@iconify/react'
import { useEdges, useNodes } from '@xyflow/react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeListbox from '../../components/Node/NodeListbox'
import NodeListboxOption from '../../components/Node/NodeListboxOption'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type { ICollectionNodeData } from '../CollectionNode/types'
import FIELD_TYPES from '../SchemaNode/constants/field_types'
import type { IValueFromRequestNodeData } from '../ValueFromRequestNode/types'
import type { IFilterNodeData } from './types'

const OPERATIONS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '>=', label: 'Greater Than or Equal To' },
  { value: '<=', label: 'Less Than or Equal To' },
  { value: '~', label: 'Contains' },
  { value: '!~', label: 'Does Not Contain' }
]

function FilterNode({ id }: { id: string }) {
  const { t } = useTranslation('apps.apiBuilder')

  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { columnName, comparator } = useMemo(
    () => getNodeData<IFilterNodeData>(id),
    [getNodeData, id]
  )

  const allNodes = useNodes()

  const allEdges = useEdges()

  const targetCollection = useMemo(() => {
    return traverseGraph(allNodes, allEdges, id, [
      { dir: 'out', id: 'filter-output' },
      { dir: 'in', id: 'collection-input' }
    ])
  }, [allNodes, allEdges, id])

  const targetValueNode = useMemo(() => {
    return traverseGraph(allNodes, allEdges, id, [
      { dir: 'in', id: 'value-input' }
    ])
  }, [allNodes, allEdges, id])

  const selectableColumns = useMemo(() => {
    if (!targetCollection) return []

    const collectionNodeData = getNodeData<ICollectionNodeData>(
      targetCollection.id
    )

    return collectionNodeData.fields ?? []
  }, [targetCollection, getNodeData])

  const targetValueNodeData = useMemo(() => {
    if (!targetValueNode) return null

    if (targetValueNode.type === 'valueFromRequest') {
      const data = getNodeData<IValueFromRequestNodeData>(targetValueNode.id)

      return {
        type: 'valueFromRequest',
        requestType: data.requestType,
        field: data.field
      }
    }

    if (targetValueNode.type === 'value') {
      //TODO
    }

    return null
  }, [targetValueNode, getNodeData])

  useEffect(() => {
    if (!targetCollection) {
      updateNodeData(id, { columnName: '', comparator: '' })

      return
    }
  }, [targetCollection, id, updateNodeData])

  return (
    <NodeColumnWrapper>
      {targetCollection ? (
        <>
          <NodeColumn label="Field">
            <NodeListbox
              setValue={value => updateNodeData(id, { columnName: value })}
              value={columnName}
            >
              {selectableColumns.map(field => (
                <NodeListboxOption
                  key={field.name}
                  isSelected={field.name === columnName}
                  value={field.name}
                >
                  {field.name}
                </NodeListboxOption>
              ))}
            </NodeListbox>
          </NodeColumn>
          <NodeColumn label="Comparator">
            <NodeListbox
              buttonContent={
                <>
                  {OPERATIONS.find(op => op.value === comparator)?.label} (
                  {comparator})
                </>
              }
              setValue={value => updateNodeData(id, { comparator: value })}
              value={comparator}
            >
              {OPERATIONS.map(op => (
                <NodeListboxOption
                  key={op.value}
                  isSelected={op.value === comparator}
                  value={op.value}
                >
                  <span className="whitespace-nowrap">
                    {op.label} ({op.value})
                  </span>
                </NodeListboxOption>
              ))}
            </NodeListbox>
          </NodeColumn>
        </>
      ) : (
        <p className="text-bg-500 text-center text-sm">
          {t('empty.noCollectionConnected')}
        </p>
      )}
      <NodeColumn handle="value-input" nodeType="filter">
        {targetValueNodeData &&
          targetValueNodeData.type === 'valueFromRequest' &&
          (targetValueNodeData.field ? (
            <NodeColumnValueWrapper>
              <div className="flex-between w-full gap-3">
                <span className="flex items-center gap-2">
                  <Icon
                    className="text-bg-500 size-4"
                    icon={
                      FIELD_TYPES.find(
                        t =>
                          t.label.toLowerCase() ===
                          targetValueNodeData.field!.type
                      )?.icon || 'tabler:abc'
                    }
                  />
                  {targetValueNodeData.field.name}
                </span>
                <span className="text-bg-500">
                  {targetValueNodeData.field.type}
                  {targetValueNodeData.field.isOptional ? '?' : ''}
                </span>
              </div>
            </NodeColumnValueWrapper>
          ) : (
            <p className="text-bg-500 text-center">
              {t('empty.noFieldSelected')}
            </p>
          ))}
      </NodeColumn>
      <NodeColumn handle="filter-output" nodeType="filter" />
    </NodeColumnWrapper>
  )
}

export default FilterNode
