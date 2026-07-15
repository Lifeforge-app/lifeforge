import { Box, ModalHeader } from '@lifeforge/ui'

import InnerContent from './components/InnerContent'

function QRLoginApprovalModal({
  onClose,
  data: { scannedData }
}: {
  onClose: () => void
  data: {
    scannedData: string
  }
}) {
  return (
    <Box minWidth="40vw">
      <ModalHeader
        icon="tabler:qrcode"
        namespace="common.auth"
        title="qrLogin.approvalTitle"
        onClose={onClose}
      />
      <InnerContent scannedData={scannedData} onClose={onClose} />
    </Box>
  )
}

export default QRLoginApprovalModal
