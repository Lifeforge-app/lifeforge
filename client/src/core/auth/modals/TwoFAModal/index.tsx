import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@lifeforge/api'
import { Button, Flex, ModalHeader, toast } from '@lifeforge/ui'

import OrAuthWithDivider from '../../components/OrAuthWithDivider'
import UsingAuthApp from './components/UsingAuthApp'
import UsingEmail from './components/UsingEmail'

function TwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')

  const { authenticateWith2FA } = useAuth()

  const [authMethod, setAuthMethod] = useState<'app' | 'email'>('app')

  async function verifyOTP(otp: string) {
    if (otp.length !== 6) {
      toast.error('OTP must be 6 characters long')

      return
    }

    try {
      const name = await authenticateWith2FA({ otp, type: authMethod })

      localStorage.removeItem('otpId:2fa')
      localStorage.removeItem('otpCooldown:2fa')

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
      {authMethod === 'app' ? (
        <UsingAuthApp callback={otp => verifyOTP(otp)} />
      ) : (
        <UsingEmail callback={otp => verifyOTP(otp)} />
      )}
      <OrAuthWithDivider />
      <Button
        icon={authMethod === 'app' ? 'tabler:mail' : 'tabler:device-mobile'}
        namespace="common.auth"
        variant="secondary"
        onClick={() => {
          setAuthMethod(authMethod === 'app' ? 'email' : 'app')
        }}
      >
        {authMethod === 'app'
          ? 'modals.twoFA.buttons.useEmailOtp'
          : 'modals.twoFA.buttons.useAuthApp'}
      </Button>
    </Flex>
  )
}

export default TwoFAModal
