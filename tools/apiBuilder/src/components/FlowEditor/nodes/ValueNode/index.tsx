import { Icon } from '@iconify/react'
import { useMemo } from 'react'

import NodeColumn from '../../components/Node/NodeColumn'
import NodeColumnWrapper from '../../components/Node/NodeColumnWrapper'
import NodeListbox from '../../components/Node/NodeListbox'
import NodeListboxOption from '../../components/Node/NodeListboxOption'
import NodeTextInput from '../../components/Node/NodeTextInput'
import { useFlowStateContext } from '../../hooks/useFlowStateContext'
import type { IValueNodeData } from './types'

const DATA_TYPES = [
  {
    label: 'String',
    icon: 'tabler:abc'
  },
  {
    label: 'Number',
    icon: 'tabler:number-123'
  },
  {
    label: 'Boolean',
    icon: 'tabler:toggle-left'
  },
  {
    label: 'Array',
    icon: 'tabler:list'
  }
]

function ValueNode({ id }: { id: string }) {
  const { getNodeData, updateNodeData } = useFlowStateContext()

  const { dataType, value } = useMemo(
    () => getNodeData<IValueNodeData>(id),
    [getNodeData, id]
  )

  return (
    <NodeColumnWrapper>
      <NodeColumn label="Data Type">
        <NodeListbox
          buttonContent={
            <span className="text-bg-500 flex items-center gap-2 font-medium">
              <Icon
                className="size-4"
                icon={
                  DATA_TYPES.find(t => t.label.toLowerCase() === dataType)
                    ?.icon || 'tabler:abc'
                }
              />
              {dataType[0].toUpperCase() + dataType.slice(1)}
            </span>
          }
          setValue={newValue =>
            updateNodeData(id, {
              dataType: newValue as IValueNodeData['dataType']
            })
          }
          value={dataType}
        >
          {DATA_TYPES.map(type => (
            <NodeListboxOption
              key={type.label}
              value={type.label.toLowerCase()}
            >
              <Icon className="size-4" icon={type.icon} />
              {type.label}
            </NodeListboxOption>
          ))}
        </NodeListbox>
      </NodeColumn>
      <NodeColumn label="Value">
        {
          // TODO
        }
        <NodeTextInput
          placeholder={
            dataType === 'string'
              ? 'Enter a string value'
              : dataType === 'number'
                ? 'Enter a number'
                : dataType === 'boolean'
                  ? 'true or false'
                  : 'Enter array values (comma separated)'
          }
          setValue={newValue => updateNodeData(id, { value: newValue })}
          value={value}
        />
      </NodeColumn>
      <NodeColumn handle="value-output" nodeType="value" />
    </NodeColumnWrapper>
  )
}

export default ValueNode
