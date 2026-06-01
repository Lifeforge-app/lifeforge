import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAuth } from '@lifeforge/shared'
import { Box, ModalHeader } from '@lifeforge/ui'

import TwoFAEnableProcedure from './components/TwoFAEnableProcedure'

function EnableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.accountSettings')

  const { setUserData } = useAuth()

  const handleSuccess = useCallback(() => {
    setUserData(userData =>
      userData ? { ...userData, twoFAEnabled: true } : null
    )
    toast.success(t('messages.twoFA.enableSuccess'))
    onClose()
  }, [])

  return (
    <Box maxWidth={{ lg: '30em' }}>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="common.accountSettings"
        title="enable2FA"
        onClose={onClose}
      />
      <TwoFAEnableProcedure onSuccess={handleSuccess} />
    </Box>
  )
}

export default EnableTwoFAModal
