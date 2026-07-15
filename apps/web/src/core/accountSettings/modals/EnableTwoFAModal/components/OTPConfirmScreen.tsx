import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Flex, OTPInputBox, Text, toast } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function OTPConfirmScreen({
  tid,
  onSuccess
}: {
  tid: string
  onSuccess: () => void
}) {
  const { t } = useTranslation('common.account-settings')
  const [otp, setOtp] = useState('')
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  async function verifyOTP() {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))

      return
    }

    setVerifyOtpLoading(true)

    try {
      await forgeAPI.auth['2fa'].enable.mutateRaw({ otp, tid })

      onSuccess()
    } catch {
      toast.error(t('otp.messages.failed'))
    } finally {
      setVerifyOtpLoading(false)
    }
  }

  return (
    <Flex centered direction="column">
      <Text color="muted" mb="lg">
        {t('modals.enable2FA.confirmationDescription')}
      </Text>
      <OTPInputBox
        lighter
        otp={otp}
        setOtp={setOtp}
        verifyOTP={verifyOTP}
        verifyOtpLoading={verifyOtpLoading}
      />
    </Flex>
  )
}

export default OTPConfirmScreen
