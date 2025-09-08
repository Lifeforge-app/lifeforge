import { useReactFlow } from '@xyflow/react'
import { Button } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import { useFlowStateContext } from '../../../hooks/useFlowStateContext'

export function SaveButton() {
  const { nodeData } = useFlowStateContext()

  const { toObject } = useReactFlow()

  const handleSave = () => {
    const json = toObject()

    const flowData = { ...json, nodeData }

    localStorage.setItem('flowData', JSON.stringify(flowData))
    toast.success('Flow saved successfully!')
  }

  return <Button icon="uil:save" variant="plain" onClick={handleSave} />
}
