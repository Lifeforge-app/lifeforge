import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function ResendOTPButton({
  otpCooldown,
  sendOtpLoading,
  onClick: requestOTP,
  buttonFullWidth
}: {
  otpCooldown: number
  sendOtpLoading: boolean
  onClick: () => void
  buttonFullWidth?: boolean
}) {
  const { t } = useTranslation('common.vault')

  return (
    <Button
      className={clsx('w-full', !buttonFullWidth && 'md:w-3/4 xl:w-1/2')}
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
