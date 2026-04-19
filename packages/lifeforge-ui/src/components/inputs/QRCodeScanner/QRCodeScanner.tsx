import { Scanner } from '@yudiel/react-qr-scanner'

import { ModalHeader } from '@components/overlays'

function QRCodeScanner({
  onClose,
  data: { formats, onScanned }
}: {
  onClose: () => void
  data: {
    formats?: (
      | 'aztec'
      | 'code_128'
      | 'code_39'
      | 'code_93'
      | 'codabar'
      | 'databar'
      | 'databar_expanded'
      | 'databar_limited'
      | 'data_matrix'
      | 'dx_film_edge'
      | 'ean_13'
      | 'ean_8'
      | 'itf'
      | 'maxi_code'
      | 'micro_qr_code'
      | 'pdf417'
      | 'qr_code'
      | 'rm_qr_code'
      | 'upc_a'
      | 'upc_e'
      | 'linear_codes'
      | 'matrix_codes'
      | 'any'
      | 'unknown'
    )[]
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
