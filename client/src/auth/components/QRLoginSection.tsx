import { Button, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import QRLoginModal from '../modals/QRLoginModal'

function QRLoginSection() {
  const { t } = useTranslation('common.auth')

  const open = useModalStore(state => state.open)

  return (
    
  )
}

export default QRLoginSection
