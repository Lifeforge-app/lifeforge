import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

function ResendOTPButton({
  otpCooldown,
  sendOtpLoading,
  requestOTP
}: {
  otpCooldown: number
  sendOtpLoading: boolean
  requestOTP: () => void
}) {
  const { t } = useTranslation('common.vault')

  return (
    <Button
      className="w-full md:w-3/4 xl:w-1/2"
      disabled={otpCooldown > 0}
      icon="tabler:refresh"
      loading={sendOtpLoading}
      variant="secondary"
      onClick={requestOTP}
    >
      {t('otp.buttons.resend')} {otpCooldown > 0 && `(${otpCooldown}s)`}
    </Button>
  )
}

export default ResendOTPButton
