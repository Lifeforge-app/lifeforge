import { Button, IconInput, ModalHeader, TextInput } from 'lifeforge-ui'
import { useState } from 'react'

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
        namespace="apps.apiBuilder"
        title="Group Configuration"
        onClose={onClose}
      />
      <TextInput
        className="mb-4"
        icon="tabler:article"
        label="Group Name"
        namespace="apps.apiBuilder"
        placeholder="Untitled Group"
        setValue={_setName}
        value={_name}
      />
      <IconInput
        label="Group Icon"
        namespace="apps.apiBuilder"
        setValue={_setIcon}
        value={_icon}
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
