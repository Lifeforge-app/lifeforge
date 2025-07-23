import OTPInputBox from '@security/components/OTPScreen/components/OTPInputBox'
import { encrypt } from '@security/utils/encryption'
import { parse as parseCookie } from 'cookie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

function OTPConfirmScreen({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('core.accountSettings')

  const [otp, setOtp] = useState('')

  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))

      return
    }

    setVerifyOtpLoading(true)

    try {
      const challenge = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        `/user/2fa/challenge`
      )

      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `/user/2fa/verify-and-enable`,
        {
          method: 'POST',
          body: {
            otp: encrypt(
              encrypt(otp, challenge),
              parseCookie(document.cookie).session ?? ''
            )
          }
        }
      )

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
