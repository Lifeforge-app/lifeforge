import forgeAPI from '@/utils/forgeAPI'
import { Button, ModalHeader, OTPInputBox } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'shared'

function DisableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.accountSettings')

  const { setUserData } = useAuth()

  const [otp, setOtp] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 characters long')

      return
    }

    setLoading(true)

    try {
      await forgeAPI.user['2fa'].verifyForDisable.mutate({ otp })
      await forgeAPI.user['2fa'].disable.mutate({})

      setUserData(userData =>
        userData ? { ...userData, twoFAEnabled: false } : null
      )
      toast.success(t('messages.twoFA.disableSuccess'))
      onClose()
    } catch {
      toast.error('Invalid OTP or failed to disable 2FA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access-off"
        namespace="common.accountSettings"
        title="disable2FA"
        onClose={onClose}
      />
      <p className="text-bg-500 mb-4">{t('modals.disable2FA.description')}</p>
      <p className="text-bg-500 mb-4">
        Enter the 6-digit code from your authenticator app to confirm:
      </p>
      <OTPInputBox
        buttonFullWidth
        lighter
        otp={otp}
        setOtp={setOtp}
        verifyOTP={handleConfirm}
        verifyOtpLoading={loading}
      />
      <Button
        className="mt-2 w-full"
        icon=""
        variant="secondary"
        onClick={onClose}
      >
        Cancel
      </Button>
    </div>
  )
}

export default DisableTwoFAModal
