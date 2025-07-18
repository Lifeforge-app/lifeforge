import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import OTPInputBox from '@security/components/OTPScreen/components/OTPInputBox'

function UsingAuthApp({
  callback
}: {
  callback: (otp: string) => Promise<void>
}) {
  const { t } = useTranslation('common.auth')

  const [otp, setOTP] = useState('')

  const [loading, setLoading] = useState(false)

  return (
    <>
      <p className="mb-6">{t('modals.twoFA.description')}</p>
      <div className="flex-center w-full flex-col">
        <OTPInputBox
          buttonFullWidth
          lighter
          otp={otp}
          setOtp={setOTP}
          verifyOTP={async otp => {
            setLoading(true)
            callback(otp).finally(() => {
              setLoading(false)
            })
          }}
          verifyOtpLoading={loading}
        />
      </div>
    </>
  )
}

export default UsingAuthApp
