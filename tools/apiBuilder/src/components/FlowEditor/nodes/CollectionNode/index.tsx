import { Icon } from '@iconify/react'
import { Button, useModalStore } from 'lifeforge-ui'
import { useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import CollectionSelector from './components/CollectionSelector'
import type { ICollectionNodeData } from './types'

function CollectionNode({ id }: { id: string }) {
  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { name, type, fields } = useMemo(() => {
    return getNodeData<ICollectionNodeData>(id)
  }, [getNodeData, id])

  const open = useModalStore(s => s.open)

  return (
    <NodeColumnWrapper>
      <NodeColumn label="Collection">
        {!name ? (
          <Button
            className="w-full p-2!"
            icon="tabler:folder"
            variant="secondary"
            onClick={() => {
              open(CollectionSelector, {
                onSelect: (selectedCollection: ICollectionNodeData) => {
                  updateNodeData(id, selectedCollection)
                }
              })
            }}
          >
            Select
          </Button>
        ) : (
          <div className="border-bg-200 dark:border-bg-800 component-bg-lighter flex h-10 w-full items-center gap-2 rounded-md border px-3">
            <Icon
              className="text-bg-500 size-5"
              icon={type === 'base' ? 'tabler:folder' : 'tabler:columns-3'}
            />
            <span className="truncate">{name}</span>
          </div>
        )}
      </NodeColumn>
      {fields.length > 0 && (
        <NodeColumn label="Fields">
          <div className="flex flex-col gap-1">
            {fields.map((field, index) => (
              <div
                key={index}
                className="border-bg-200 dark:border-bg-800 component-bg-lighter flex items-center justify-between gap-3 rounded border p-2"
              >
                <span className="text-bg-600 dark:text-bg-400 truncate">
                  {field.name}
                </span>
                <span className="text-bg-500">
                  {field.type}
                  {field.optional && '?'}
                </span>
              </div>
            ))}
          </div>
        </NodeColumn>
      )}
      <NodeColumn handle="collection-output" nodeType="collection" />
    </NodeColumnWrapper>
  )
}

export default CollectionNode
