import { Button } from 'lifeforge-ui'

import { useFlowStateContext } from '../../../hooks/useFlowStateContext'

function ExportButton() {
  const { nodes, edges, nodeData } = useFlowStateContext()

  const exportFLow = () => {
    const flowData = {
      nodes,
      edges,
      nodeData
    }

    const blob = new Blob([JSON.stringify(flowData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = 'lifeforge-flow.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return <Button icon="uil:export" variant="plain" onClick={exportFLow} />
}

export default ExportButton
