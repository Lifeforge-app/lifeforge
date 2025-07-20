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
        icon="tabler:settings"
        namespace="core.apiBuilder"
        title="Group Configuration"
        onClose={onClose}
      />
      <TextInput
        darker
        className="mb-4"
        icon="tabler:article"
        name="Group Name"
        namespace="core.apiBuilder"
        placeholder="Untitled Group"
        setValue={_setName}
        value={_name}
      />
      <IconInput
        icon={_icon}
        name="Group Icon"
        namespace="core.apiBuilder"
        setIcon={_setIcon}
      />
      <Button
        className="mt-6 w-full"
        icon="uil:save"
        onClick={() => {
          updateNodeData(nodeId, {
            name: _name,
            icon: _icon
          })
          onClose()
        }}
      >
        Save
      </Button>
    </div>
  )
}

export default GroupNodeConfigModal
