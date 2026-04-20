import { Scanner } from '@yudiel/react-qr-scanner'

import { ModalHeader } from '@components/overlays'
import { Box } from '@components/primitives'

import * as styles from './QRCodeScanner.css'

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
    <Box minWidth="30vw">
      <ModalHeader
        icon="tabler:qrcode"
        title="qrCodeScanner"
        onClose={onClose}
      />
      <Box
        height="100%"
        overflow="hidden"
        position="relative"
        rounded="lg"
        style={{ aspectRatio: '1 / 1' }}
        width="100%"
      >
        <Scanner
          allowMultiple={false}
          classNames={{
            container: styles.scannerContainer,
            video: styles.scannerVideo
          }}
          formats={formats}
          onScan={codes => {
            onClose()
            onScanned(codes[0].rawValue)
          }}
        />
      </Box>
    </Box>
  )
}

export default QRCodeScanner
