import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePromiseLoading } from '@lifeforge/api'
import { OTPInputBox, Text } from '@lifeforge/ui'

function UsingAuthApp({
  callback
}: {
  callback: (otp: string) => Promise<void>
}) {
  const { t } = useTranslation('common.auth')
  const [otp, setOTP] = useState('')
  const [loading, onCallback] = usePromiseLoading(callback)

  return (
    <>
      <Text color="muted" mb="lg">
        {t('modals.twoFA.description')}
      </Text>
      <OTPInputBox
        lighter
        otp={otp}
        setOtp={setOTP}
        verifyOTP={onCallback}
        verifyOtpLoading={loading}
      />
    </>
  )
}

export default UsingAuthApp
