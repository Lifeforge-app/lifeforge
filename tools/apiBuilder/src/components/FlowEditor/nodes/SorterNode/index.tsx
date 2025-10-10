import { Icon } from '@iconify/react'
import { useEdges, useNodes } from '@xyflow/react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeListbox from '../../components/Node/NodeListbox'
import NodeListboxOption from '../../components/Node/NodeListboxOption'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import { traverseGraph } from '../../utils/traverseGraph'
import type { ICollectionNodeData } from '../CollectionNode/types'
import type { ISorterNodeData } from './types'

const SORT_ORDER_OPTIONS = [
  { value: 'asc', icon: 'tabler:sort-ascending' },
  { value: 'desc', icon: 'tabler:sort-descending' }
]

function SorterNode({ id }: { id: string }) {
  const { t } = useTranslation('apps.apiBuilder')

  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { direction, field } = useMemo(
    () => getNodeData<ISorterNodeData>(id),
    [getNodeData, id]
  )

  const allNodes = useNodes()

  const allEdges = useEdges()

  const targetCollection = useMemo(() => {
    return traverseGraph(allNodes, allEdges, id, [
      { dir: 'out', id: 'sorter-output' },
      { dir: 'in', id: 'collection-input' }
    ])
  }, [allNodes, allEdges, id])

  const selectableColumns = useMemo(() => {
    if (!targetCollection) return []

    const collectionNodeData = getNodeData<ICollectionNodeData>(
      targetCollection.id
    )

    return collectionNodeData.fields ?? []
  }, [targetCollection, getNodeData])

  useEffect(() => {
    if (!targetCollection) {
      updateNodeData(id, { field: '', direction: 'asc' })
    }
  }, [targetCollection, id, updateNodeData])

  return (
    <NodeColumnWrapper>
      {targetCollection ? (
        <>
          <NodeColumn label="Field">
            <NodeListbox
              setValue={value => updateNodeData(id, { field: value })}
              value={field}
            >
              {selectableColumns.map(f => (
                <NodeListboxOption
                  key={f.name}
                  isSelected={f.name === field}
                  value={f.name}
                >
                  {f.name}
                </NodeListboxOption>
              ))}
            </NodeListbox>
          </NodeColumn>
          <NodeColumn label="Direction">
            <NodeListbox
              buttonContent={
                <span className="flex items-center gap-2">
                  <Icon
                    className="text-bg-500 size-5"
                    icon={
                      SORT_ORDER_OPTIONS.find(
                        option => option.value === direction
                      )?.icon || 'tabler:sort-ascending'
                    }
                  />
                  {t(`misc.${direction.toLocaleLowerCase()}`)}
                </span>
              }
              setValue={value => updateNodeData(id, { direction: value })}
              value={direction}
            >
              {SORT_ORDER_OPTIONS.map(option => (
                <NodeListboxOption
                  key={option.value}
                  isSelected={option.value === direction}
                  value={option.value}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="text-bg-500 size-5" icon={option.icon} />
                    {t(`misc.${option.value.toLocaleLowerCase()}`)}
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
      <NodeColumn handle="sorter-output" nodeType="sorter" />
    </NodeColumnWrapper>
  )
}

export default SorterNode
