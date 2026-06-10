import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  OptionsColumn,
  QRCodeScanner,
  toast,
  useModalStore
} from '@lifeforge/ui'

import QRLoginApprovalModal from '../modals/QRLoginScannerModal'

function QRLoginColumn() {
  const { open } = useModalStore()
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
        icon="tabler:scan"
        namespace="common.auth"
        variant="secondary"
        width="100%"
        onClick={handleOpenScanner}
      >
        qrLogin.title
      </Button>
    </OptionsColumn>
  )
}

export default QRLoginColumn
