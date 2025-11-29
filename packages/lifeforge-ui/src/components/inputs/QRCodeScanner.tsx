import { Scanner } from '@yudiel/react-qr-scanner'

import { ModalHeader } from '@components/overlays'

function QRCodeScanner({
  onClose,
  data: { formats, onScanned }
}: {
  onClose: () => void
  data: {
    formats?: BarcodeFormat[]
    onScanned: (data: string) => void
  }
}) {
  return (
    <>
      <ModalHeader
        icon="tabler:qrcode"
        title="qrCodeScanner"
        onClose={onClose}
      />
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
    </>
  )
}

export default QRCodeScanner
