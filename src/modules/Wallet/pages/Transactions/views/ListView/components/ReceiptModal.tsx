import React from 'react'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'

function ReceiptModal({
  isOpen,
  setOpen,
  receiptSrc
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  receiptSrc: string
}): React.ReactElement {
  return (
    <Modal isOpen={isOpen}>
      <ModalHeader
        title="View Receipt"
        icon="tabler:receipt"
        onClose={() => {
          setOpen(false)
        }}
      />
      <div className="flex w-full justify-center sm:w-96">
        <img src={receiptSrc} alt="receipt" />
      </div>
    </Modal>
  )
}

export default ReceiptModal
