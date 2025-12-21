import {
  Button,
  OptionsColumn,
  QRCodeScanner,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import QRLoginApprovalModal from '../modals/QRLoginScannerModal'

function QRLoginColumn() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('common.auth')

  const handleOpenScanner = useCallback(() => {
    open(QRCodeScanner, {
      onScanned: (scannedData: string) => {
        // Validate that this is a LifeForge QR login code
        try {
          const parsed = JSON.parse(scannedData)

          if (parsed.type !== 'lifeforge-qr-login') {
            toast.error(t('qrLogin.invalidQR'))

            return
          }

          setTimeout(() => {
            open(QRLoginApprovalModal, { scannedData })
          }, 500)
        } catch {
          toast.error(t('qrLogin.invalidQR'))
        }
      }
    })
  }, [open, t])

  return (
    <OptionsColumn
      description={t('qrLogin.description')}
      icon="tabler:qrcode"
      title={t('qrLogin.scanQRCode')}
    >
      <Button
        className="w-full"
        icon="tabler:scan"
        namespace="common.auth"
        variant="secondary"
        onClick={handleOpenScanner}
      >
        qrLogin.title
      </Button>
    </OptionsColumn>
  )
}

export default QRLoginColumn
