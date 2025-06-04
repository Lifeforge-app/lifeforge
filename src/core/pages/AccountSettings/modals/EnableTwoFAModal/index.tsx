import clsx from 'clsx'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ModalHeader } from '@lifeforge/ui'

import OTPScreen from '@security/components/OTPScreen'

import useComponentBg from '@hooks/useComponentBg'

import { useAuth } from '../../../../providers/AuthProvider'
import TwoFAEnableProcedure from './components/TwoFAEnableProcedure'

function EnableTwoFAModal({
  onClose
}: {
  onClose: () => void
}): React.ReactElement {
  const { t } = useTranslation('core.accountSettings')
  const { setUserData } = useAuth()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const { componentBgLighter } = useComponentBg()

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
        <div
          className={clsx(
            'shadow-custom mt-6 rounded-lg p-6',
            componentBgLighter
          )}
        >
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
