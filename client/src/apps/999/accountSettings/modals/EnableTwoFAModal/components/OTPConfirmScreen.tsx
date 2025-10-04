import forgeAPI from '@/utils/forgeAPI'
import { OTPInputBox } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { encrypt } from 'shared'

function OTPConfirmScreen({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('apps.accountSettings')

  const [otp, setOtp] = useState('')

  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))

      return
    }

    setVerifyOtpLoading(true)

    try {
      const challenge = await forgeAPI.user['2fa'].getChallenge.query()

      await forgeAPI.user['2fa'].verifyAndEnable.mutate({
        otp: encrypt(encrypt(otp, challenge), localStorage.getItem('session')!)
      })

      onSuccess()
    } catch {
      toast.error(t('otp.messages.failed'))
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  return (
    <div className="flex-center flex-col">
      <p className="text-bg-500 mb-6">
        {t('modals.enable2FA.confirmationDescription')}
      </p>
      <OTPInputBox
        buttonFullWidth
        lighter
        otp={otp}
        setOtp={setOtp}
        verifyOTP={verifyOTP}
        verifyOtpLoading={verifyOtpLoading}
      />
    </div>
  )
}

export default OTPConfirmScreen
