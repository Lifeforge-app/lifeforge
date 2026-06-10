import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { encrypt } from '@lifeforge/api'
import { Flex, OTPInputBox, Text, toast } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function OTPConfirmScreen({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation('common.accountSettings')
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
