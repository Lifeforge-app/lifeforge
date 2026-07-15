import { useTranslation } from 'react-i18next'

import { useAuth } from '@lifeforge/api'
import { Flex, ModalHeader, toast } from '@lifeforge/ui'

import UsingAuthApp from './components/UsingAuthApp'

function TwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')
  const { authenticateWith2FA } = useAuth()

  async function verifyOTP(otp: string) {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits')

      return
    }

    try {
      const name = await authenticateWith2FA(otp)

      toast.success(t('messages.welcomeBack', { name }))
      onClose()
    } catch {
      toast.error('Invalid OTP')
    }
  }

  return (
    <Flex direction="column" minWidth="40vw">
      <ModalHeader
        icon="tabler:lock-access"
        namespace="common.auth"
        title="twoFA"
        onClose={() => {
          window.location.reload()
        }}
      />
      <UsingAuthApp callback={verifyOTP} />
    </Flex>
  )
}

export default TwoFAModal
