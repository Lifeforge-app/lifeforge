import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

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
      className="w-full"
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
