import { ModalHeader, ModalWrapper } from '@components/modals'
import { Scanner } from '@yudiel/react-qr-scanner'

function QRCodeScanner({
  isOpen,
  onClose,
  formats,
  onScanned
}: {
  isOpen: boolean
  onClose: () => void
  formats?: BarcodeFormat[]
  onScanned: (data: string) => void
}) {
  return (
    <ModalWrapper isOpen={isOpen} minHeight="30rem" zIndex={1000}>
      <ModalHeader
        icon="tabler:qrcode"
        title="qrCodeScanner"
        onClose={onClose}
      />
      {isOpen && (
        <div className="relative aspect-square h-full w-full">
          <Scanner
            allowMultiple={false}
            classNames={{
              container:
                'size-full! [&_svg]:size-full! [&_div_div_div:has(svg)]:hidden',
              video:
                'top-1/2! left-1/2! absolute! -translate-x-1/2! -translate-y-1/2!'
            }}
            formats={formats}
            onScan={codes => {
              onClose()
              onScanned(codes[0].rawValue)
            }}
          />
        </div>
      )}
    </ModalWrapper>
  )
}

export default QRCodeScanner
