import { ModalHeader } from '@lifeforge/ui'

function ViewReceiptModal({
  data: { src },
  onClose
}: {
  data: { src: string }
  onClose: () => void
}) {
  return (
    <div>
      <ModalHeader
        icon="tabler:receipt"
        namespace="apps.wallet"
        title="receipts.view"
        onClose={onClose}
      />
      <div className="flex w-full justify-center sm:min-w-96">
        {src !== '' && <img key={src} alt="receipt" src={src} />}
      </div>
    </div>
  )
}

export default ViewReceiptModal
