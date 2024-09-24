import React from 'react'
import ModalWrapper from '@components/Modals/ModalWrapper'
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
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        title="View Receipt"
        icon="tabler:receipt"
        onClose={() => {
          setOpen(false)
        }}
      />
      <div className="flex w-full justify-center sm:w-96">
        {receiptSrc !== '' && (
          <img key={receiptSrc} src={receiptSrc} alt="receipt" />
        )}
      </div>
    </ModalWrapper>
  )
}

export default ReceiptModal
