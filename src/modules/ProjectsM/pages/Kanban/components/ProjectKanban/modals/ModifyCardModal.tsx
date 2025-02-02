import React from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'

function ModifyCardModal({
  openType,
  setOpenType
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
}): React.ReactElement {
  return (
    <ModalWrapper isOpen={openType !== null} minHeight="70vh" minWidth="60vw">
      <ModalHeader
        icon="tabler:cards"
        title={openType === 'create' ? 'Create Card' : 'Update Card'}
        onClose={() => {
          setOpenType(null)
        }}
      />
    </ModalWrapper>
  )
}

export default ModifyCardModal
