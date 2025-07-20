import { useState } from 'react'

import { Button, IconInput, ModalHeader, TextInput } from '@lifeforge/ui'

import { useFlowStateContext } from '../../../../hooks/useFlowStateContext'

function GroupNodeConfigModal({
  onClose,
  data: { nodeId }
}: {
  onClose: () => void
  data: {
    nodeId: string
  }
}) {
  const { getNodeData, updateNodeData } = useFlowStateContext()
  const { name, icon } = getNodeData(nodeId)
  const [_name, _setName] = useState(name || '')
  const [_icon, _setIcon] = useState(icon || '')

  return (
    <div className="min-w-[30vw]">
      <ModalHeader
        namespace="core.apiBuilder"
        title="Group Configuration"
        icon="tabler:settings"
        onClose={onClose}
      />
      <TextInput
        namespace="core.apiBuilder"
        name="Group Name"
        icon="tabler:article"
        value={_name}
        setValue={_setName}
        className="mb-4"
        placeholder="Untitled Group"
        darker
      />
      <IconInput
        namespace="core.apiBuilder"
        name="Group Icon"
        icon={_icon}
        setIcon={_setIcon}
      />
      <Button
        className="mt-6 w-full"
        onClick={() => {
          updateNodeData(nodeId, {
            name: _name,
            icon: _icon
          })
          onClose()
        }}
        icon="uil:save"
      >
        Save
      </Button>
    </div>
  )
}

export default GroupNodeConfigModal
