import OTPScreen from '@security/components/OTPScreen'
import forgeAPI from '@utils/forgeAPI'
import { Button, ModalHeader } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import { useAuth } from '../../../providers/AuthProvider'

function DisableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('core.accountSettings')

  const { setUserData } = useAuth()

  const [otpSuccess, setOtpSuccess] = useState(false)

  async function handleConfirm() {
    try {
      await forgeAPI.user['2fa'].disable.mutate({})

      setUserData(userData =>
        userData ? { ...userData, twoFAEnabled: false } : null
      )
      toast.success(t('messages.twoFA.disableSuccess'))
      onClose()
    } catch {
      toast.error('Failed to disable 2FA')
    }
  }

  const [loading, onConfirm] = usePromiseLoading(handleConfirm)

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access-off"
        namespace="core.accountSettings"
        title="disable2FA"
        onClose={onClose}
      />
      {!otpSuccess ? (
        <div className="shadow-custom component-bg-lighter mt-6 rounded-lg p-6">
          <OTPScreen
            buttonsFullWidth
            callback={() => {
              setOtpSuccess(true)
            }}
            challengeController={forgeAPI.user['2fa'].getChallenge}
            verifyController={forgeAPI.user['2fa'].validateOTP}
          />
        </div>
      ) : (
        <>
          <p className="text-bg-500">{t('modals.disable2FA.description')}</p>
          <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row">
            <Button className="sm:w-1/2" icon="" onClick={onClose}>
              Cancel
            </Button>
            <Button
              dangerous
              className="sm:w-1/2"
              icon="tabler:check"
              loading={loading}
              variant="secondary"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default DisableTwoFAModal
