import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

function ResendOTPButton({
  otpCooldown,
  sendOtpLoading,
  onClick: requestOTP
}: {
  otpCooldown: number
  sendOtpLoading: boolean
  onClick: () => void
}) {
  const { t } = useTranslation('common.vault')

  return (
    <Button
      disabled={otpCooldown > 0}
      icon="tabler:refresh"
      loading={sendOtpLoading}
      variant="secondary"
      width="100%"
      onClick={requestOTP}
    >
      {t('otp.buttons.resend')} {otpCooldown > 0 && `(${otpCooldown}s)`}
    </Button>
  )
}

export default ResendOTPButton
