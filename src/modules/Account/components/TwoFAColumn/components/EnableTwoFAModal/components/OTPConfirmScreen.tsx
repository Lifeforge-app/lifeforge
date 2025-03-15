import { cookieParse } from 'pocketbase'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import OTPInputBox from '@security/components/OTPScreen/components/OTPInputBox'
import { encrypt } from '@security/utils/encryption'

import fetchAPI from '@utils/fetchAPI'

function OTPConfirmScreen({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('modules.accountSettings')
  const [otp, setOtp] = useState('')
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))
      return
    }

    setVerifyOtpLoading(true)

    try {
      const challenge = await fetchAPI<string>(`/user/2fa/challenge`)
      await fetchAPI(`/user/2fa/verify-and-enable`, {
        method: 'POST',
        body: {
          otp: encrypt(
            encrypt(otp, challenge),
            cookieParse(document.cookie).token
          )
        }
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
