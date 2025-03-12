import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

function ReceiptModal({
  isOpen,
  setOpen,
  receiptSrc
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  receiptSrc: string
}) {
  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:receipt"
        namespace="modules.wallet"
        title="receipts.view"
        onClose={() => {
          setOpen(false)
        }}
      />
      <div className="flex w-full justify-center sm:min-w-96">
        {receiptSrc !== '' && (
          <img key={receiptSrc} alt="receipt" src={receiptSrc} />
        )}
      </div>
    </ModalWrapper>
  )
}

export default ReceiptModal
