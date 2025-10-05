import { Panel } from '@xyflow/react'

import DownloadImageButton from './components/DownloadImageButton'
import ExportButton from './components/ExportButton'
import { SaveButton } from './components/SaveButton'

function ControlPanel() {
  return (
    <Panel
      className="shadow-custom bg-bg-800 overflow-hidden rounded-lg p-2"
      position="top-left"
    >
      <SaveButton />
      <DownloadImageButton />
      <ExportButton />
    </Panel>
  )
}

export default ControlPanel
