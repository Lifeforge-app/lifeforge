import { OTPInputBox } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePromiseLoading } from 'shared'

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
      <p className="mb-6">{t('modals.twoFA.description')}</p>
      <div className="flex-center w-full flex-col">
        <OTPInputBox
          buttonFullWidth
          lighter
          otp={otp}
          setOtp={setOTP}
          verifyOTP={onCallback}
          verifyOtpLoading={loading}
        />
      </div>
    </>
  )
}

export default UsingAuthApp
