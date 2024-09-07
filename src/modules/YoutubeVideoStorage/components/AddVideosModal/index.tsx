import React from 'react'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'

function AddVideosModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  return (
    <Modal isOpen={isOpen} minWidth="50vw">
      <ModalHeader title="Add Videos" icon="tabler:plus" onClose={onClose} />
    </Modal>
  )
}

export default AddVideosModal
