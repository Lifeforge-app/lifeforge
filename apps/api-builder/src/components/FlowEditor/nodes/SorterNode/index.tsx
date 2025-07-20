import { Icon } from '@iconify/react/dist/iconify.js'
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
  const { t } = useTranslation('core.apiBuilder')
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
              value={field}
              setValue={value => updateNodeData(id, { field: value })}
            >
              {selectableColumns.map(f => (
                <NodeListboxOption
                  key={f.name}
                  value={f.name}
                  isSelected={f.name === field}
                >
                  {f.name}
                </NodeListboxOption>
              ))}
            </NodeListbox>
          </NodeColumn>
          <NodeColumn label="Direction">
            <NodeListbox
              value={direction}
              setValue={value => updateNodeData(id, { direction: value })}
              buttonContent={
                <span className="flex items-center gap-2">
                  <Icon
                    icon={
                      SORT_ORDER_OPTIONS.find(
                        option => option.value === direction
                      )?.icon || 'tabler:sort-ascending'
                    }
                    className="text-bg-500 size-5"
                  />
                  {t(`misc.${direction.toLocaleLowerCase()}`)}
                </span>
              }
            >
              {SORT_ORDER_OPTIONS.map(option => (
                <NodeListboxOption
                  key={option.value}
                  value={option.value}
                  isSelected={option.value === direction}
                >
                  <span className="flex items-center gap-2">
                    <Icon icon={option.icon} className="text-bg-500 size-5" />
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
      <NodeColumn nodeType="sorter" handle="sorter-output" />
    </NodeColumnWrapper>
  )
}

export default SorterNode
