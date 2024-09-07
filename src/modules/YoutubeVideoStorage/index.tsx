import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import AddVideosModal from './components/AddVideosModal'

function YoutubeVideoStorage(): React.ReactElement {
  const [isAddVideosModalOpen, setIsAddVideosModalOpen] = useState(false)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Youtube Video Storage"
        desc="..."
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              setIsAddVideosModalOpen(true)
            }}
          >
            Add Video
          </Button>
        }
      />
      <AddVideosModal
        isOpen={isAddVideosModalOpen}
        onClose={() => {
          setIsAddVideosModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideoStorage
