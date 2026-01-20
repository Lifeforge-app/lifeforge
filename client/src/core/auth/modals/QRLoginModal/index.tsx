import { ModalHeader } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import QRContent from './components/QRContent'

function QRLoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')

  return (
    <>
      <ModalHeader
        icon="tabler:qrcode"
        namespace="common.auth"
        title="qrLogin.title"
        onClose={onClose}
      />
      <p className="text-bg-500 mb-6">{t('qrLogin.description')}</p>

      <QRContent onClose={onClose} />
    </>
  )
}

export default QRLoginModal
