import { useAuth } from '@providers/AuthProvider'
import OTPInputBox from '@security/components/OTPScreen/components/OTPInputBox'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

function TwoFAModal() {
  const { t } = useTranslation('common.auth')
  const { twoFAModalOpen, setTwoFAModalOpen, authenticateWith2FA } = useAuth()
  const [otp, setOTP] = useState('')
  const [loading, setLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 characters long')
      return
    }

    setLoading(true)
    try {
      const name = await authenticateWith2FA({ otp })

      toast.success(t('welcome') + name)
      setTwoFAModalOpen(false)
    } catch {
      toast.error('Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper isOpen={twoFAModalOpen}>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="common.auth"
        title="twoFA"
        onClose={() => {
          window.location.reload()
        }}
      />
      <p className="mb-6">{t('modals.twoFA.description')}</p>
      <div className="w-full flex-center flex-col">
        <OTPInputBox
          buttonFullWidth
          lighter
          otp={otp}
          setOtp={setOTP}
          verifyOTP={verifyOTP}
          verifyOtpLoading={loading}
        />
      </div>
    </ModalWrapper>
  )
}

export default TwoFAModal
