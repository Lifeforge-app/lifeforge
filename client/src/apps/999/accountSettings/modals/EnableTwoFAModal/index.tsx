import forgeAPI from '@/utils/forgeAPI'
import { ModalHeader, WithOTP } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'shared'

import TwoFAEnableProcedure from './components/TwoFAEnableProcedure'

function EnableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('apps.accountSettings')

  const { setUserData } = useAuth()

  const handleSuccess = useCallback(() => {
    setUserData(userData =>
      userData ? { ...userData, twoFAEnabled: true } : null
    )
    toast.success(t('messages.twoFA.enableSuccess'))
    onClose()
  }, [])

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="apps.accountSettings"
        title="enable2FA"
        onClose={onClose}
      />
      <WithOTP
        controllers={{
          getChallenge: forgeAPI.user['2fa'].getChallenge,
          verifyOTP: forgeAPI.user['2fa'].validateOTP,
          generateOTP: forgeAPI.user.auth.generateOTP
        }}
      >
        <TwoFAEnableProcedure onSuccess={handleSuccess} />
      </WithOTP>
    </div>
  )
}

export default EnableTwoFAModal
