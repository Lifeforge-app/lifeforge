import OTPScreen from '@security/components/OTPScreen'
import { ModalHeader } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAuth } from '../../../../providers/AuthProvider'
import TwoFAEnableProcedure from './components/TwoFAEnableProcedure'

function EnableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('core.accountSettings')

  const { setUserData } = useAuth()

  const [otpSuccess, setOtpSuccess] = useState(false)

  const handleSuccess = useCallback(() => {
    setUserData((userData: any) => ({
      ...userData,
      twoFAEnabled: true
    }))
    toast.success(t('messages.twoFA.enableSuccess'))
    onClose()
  }, [])

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="core.accountSettings"
        title="enable2FA"
        onClose={onClose}
      />
      {!otpSuccess ? (
        <div className="shadow-custom component-bg-lighter mt-6 rounded-lg p-6">
          <OTPScreen
            buttonsFullWidth
            callback={() => {
              setOtpSuccess(true)
            }}
            endpoint="/user/2fa"
          />
        </div>
      ) : (
        <TwoFAEnableProcedure onSuccess={handleSuccess} />
      )}
    </div>
  )
}

export default EnableTwoFAModal
