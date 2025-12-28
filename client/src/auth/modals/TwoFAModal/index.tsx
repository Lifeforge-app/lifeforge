import { ModalHeader } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'shared'

import UsingAuthApp from './components/UsingAuthApp'

function TwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')

  const { authenticateWith2FA } = useAuth()

  async function verifyOTP(otp: string) {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 characters long')

      return
    }

    try {
      const name = await authenticateWith2FA({ otp })

      toast.success(t('messages.welcomeBack', { name }))
      onClose()
    } catch {
      toast.error('Invalid OTP')
    }
  }

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="common.auth"
        title="twoFA"
        onClose={() => {
          window.location.reload()
        }}
      />
      <UsingAuthApp callback={otp => verifyOTP(otp)} />
    </div>
  )
}

export default TwoFAModal
