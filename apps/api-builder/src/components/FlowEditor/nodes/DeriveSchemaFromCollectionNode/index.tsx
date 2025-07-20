import { useEdges, useNodes } from '@xyflow/react'
import _ from 'lodash'
import { singular } from 'pluralize'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnValueWrapper from '../../components/Node/NodeColumnValueWrapper'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type {
  ICollectionField,
  ICollectionNodeData
} from '../CollectionNode/types'
import FieldsColumn from '../SchemaNode/components/FieldsColumn'
import type { ISchemaField } from '../SchemaNode/types'
import type { IDeriveSchemaFromCollectionNodeData } from './types'

function transformFields(fields: ICollectionField[]): ISchemaField[] {
  return fields
    .filter(
      field =>
        ![
          'id',
          'created',
          'updated',
          'collectionId',
          'collectionName'
        ].includes(field.name)
    )
    .map(field => ({
      ...field,
      name: _.camelCase(field.name),
      type: (() => {
        switch (field.type) {
          case 'text':
            return 'string'
          case 'richtext':
            return 'string'
          case 'number':
            return 'number'
          case 'bool':
            return 'boolean'
          case 'email':
            return 'email'
          case 'url':
            return 'url'
          case 'date':
            return 'date'
          case 'autodate':
            return 'string'
          case 'select':
            return 'enum'
          case 'file':
            return 'file'
          case 'relation':
            return 'string'
          case 'json':
            return 'any'
          case 'geoPoint':
            return 'object'
          case 'password':
            return 'string'
          default:
            return 'unknown'
        }
      })(),
      options: field.type === 'select' ? field.values : undefined,
      isOptional: field.optional || false
    }))
}

function DeriveSchemaFromCollectionNode({ id }: { id: string }) {
  const { t } = useTranslation('core.apiBuilder')
  const nodes = useNodes()
  const edges = useEdges()
  const { getNodeData, updateNodeData } = useFlowStateContext()
  const { collectionName, name, typescriptInterfaceName, fields } = useMemo(
    () => getNodeData<IDeriveSchemaFromCollectionNodeData>(id),
    [getNodeData, id]
  )

  const collectionInputNode = useMemo(
    () =>
      traverseGraph(nodes, edges, id, [{ dir: 'in', id: 'collection-input' }]),
    [nodes, edges, id]
  )
  const collectionInputNodeData = useMemo(
    () =>
      collectionInputNode
        ? getNodeData<ICollectionNodeData>(collectionInputNode.id)
        : null,
    [collectionInputNode, getNodeData]
  )

  useEffect(() => {
    if (collectionInputNodeData) {
      const { name, fields } = collectionInputNodeData
      let baseName: string
      if (name.endsWith('_aggregated')) {
        baseName = _.upperFirst(
          _.camelCase(
            singular(name.replace(/_aggregated$/, '')) + '_aggregated'
          )
        )
      } else {
        baseName = _.upperFirst(_.camelCase(singular(name)))
      }

      const schemaName = `${baseName}Schema`
      const typescriptInterfaceName = `I${baseName}`
      const schemaFields = transformFields(fields)

      updateNodeData(id, {
        collectionName: name,
        name: schemaName,
        typescriptInterfaceName,
        fields: schemaFields
      })
    } else {
      updateNodeData(id, {
        collectionName: '',
        name: '',
        typescriptInterfaceName: '',
        fields: []
      })
    }
  }, [collectionInputNodeData, id, updateNodeData])

  return (
    <NodeColumnWrapper>
      <NodeColumn
        nodeType="deriveSchemaFromCollection"
        handle="collection-input"
      >
        {collectionName && (
          <NodeColumnValueWrapper>{collectionName}</NodeColumnValueWrapper>
        )}
      </NodeColumn>
      {name && (
        <NodeColumn label="Schema Name">
          <NodeColumnValueWrapper>{name}</NodeColumnValueWrapper>
        </NodeColumn>
      )}
      {typescriptInterfaceName && (
        <NodeColumn label="TypeScript Interface Name">
          <NodeColumnValueWrapper>
            {typescriptInterfaceName}
          </NodeColumnValueWrapper>
        </NodeColumn>
      )}
      {collectionInputNodeData && (
        <NodeColumn label="Fields">
          {fields.length > 0 ? (
            <FieldsColumn withLabel={false} fields={fields} />
          ) : (
            <p className="text-bg-500 text-center">{t('empty.noFields')}</p>
          )}
        </NodeColumn>
      )}
      <NodeColumn
        nodeType="deriveSchemaFromCollection"
        handle="schema-output"
      />
    </NodeColumnWrapper>
  )
}

export default DeriveSchemaFromCollectionNode
