import { Icon } from '@iconify/react/dist/iconify.js'
import { useEdges, useNodes } from '@xyflow/react'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeListbox from '../../components/Node/NodeListbox'
import NodeListboxOption from '../../components/Node/NodeListboxOption'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { findNodeTypeInGraph } from '../../utils/findNodeTypeInGraph'
import { traverseGraph } from '../../utils/traverseGraph'
import FieldColumn from '../SchemaNode/components/FieldColumn'
import FIELD_TYPES from '../SchemaNode/constants/field_types'
import type { ISchemaField } from '../SchemaNode/types'
import type { IPickFieldsFromSchemaNodeData } from '../SchemaPickFieldsNode/types'
import type { IValueFromRequestNodeData } from './types'

function ValueFromRequest({ id }: { id: string }) {
  const { t } = useTranslation('core.apiBuilder')
  const nodes = useNodes()
  const edges = useEdges()
  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { requestType, field } = useMemo(
    () => getNodeData<IValueFromRequestNodeData>(id),
    [getNodeData, id]
  )
  const requestSchemaNode = useMemo(() => {
    const controller = findNodeTypeInGraph(nodes, edges, id, 'controller', true)
    if (!controller) return null
    const requestSchemaNode = traverseGraph(nodes, edges, controller.id, [
      { dir: 'in', id: 'request-schema-input' }
    ])
    if (!requestSchemaNode) return null
    return requestSchemaNode
  }, [nodes, edges, id])

  const fieldOptions = useMemo(() => {
    if (!requestSchemaNode) return []

    const selectableColumns: {
      from: 'params' | 'query' | 'body'
      field: ISchemaField
    }[] = []

    for (const type of ['params', 'query', 'body'] as const) {
      const schemaNode = traverseGraph(nodes, edges, requestSchemaNode.id, [
        { dir: 'in', id: `${type}-schema-input` }
      ])
      if (schemaNode) {
        const schemaData = getNodeData<IPickFieldsFromSchemaNodeData>(
          schemaNode.id
        )
        selectableColumns.push(
          ...schemaData.fields.map(field => ({
            from: type,
            field
          }))
        )
      }
    }

    return selectableColumns
  }, [nodes, edges, requestSchemaNode, getNodeData])

  useEffect(() => {
    if (!requestSchemaNode) {
      updateNodeData(id, { requestType: undefined, field: undefined })
      return
    }
  }, [requestSchemaNode, id, updateNodeData])

  useEffect(() => {
    if (
      field &&
      !fieldOptions.some(option => option.field.name === field.name)
    ) {
      updateNodeData(id, { requestType: undefined, field: undefined })
    }
  }, [field, fieldOptions, id, updateNodeData])

  return (
    <NodeColumnWrapper>
      {requestSchemaNode ? (
        <NodeColumn label="Field">
          <NodeListbox
            value={{ requestType, field }}
            setValue={value => {
              updateNodeData(id, value)
            }}
            buttonContent={
              field && (
                <FieldColumn
                  field={field}
                  withWrapper={false}
                  rightComponent={
                    <span className="text-bg-500 text-sm">
                      ({t(`nodeColumns.${_.camelCase(requestType)}`)})
                    </span>
                  }
                />
              )
            }
          >
            {fieldOptions.map(option => (
              <NodeListboxOption
                key={`${option.from}||${option.field.name}`}
                value={{ requestType: option.from, field: option.field }}
                isSelected={
                  field?.name === option.field.name &&
                  requestType === option.from
                }
              >
                <span className="flex-between w-full gap-3">
                  <span className="flex items-center gap-2">
                    <Icon
                      icon={
                        FIELD_TYPES.find(
                          t => t.label.toLowerCase() === option.field.type
                        )?.icon || 'tabler:abc'
                      }
                      className="text-bg-500 size-4"
                    />
                    {option.field.name}
                  </span>
                  <span className="text-bg-500 text-sm">
                    ({t(`nodeColumns.${_.camelCase(option.from)}`)})
                  </span>
                </span>
              </NodeListboxOption>
            ))}
          </NodeListbox>
        </NodeColumn>
      ) : (
        <div className="text-bg-500 p-2 text-center">
          {t('empty.noRequestSchemaConnected')}
        </div>
      )}
      <NodeColumn nodeType="valueFromRequest" handle="value-output" />
    </NodeColumnWrapper>
  )
}

export default ValueFromRequest
