import { Button, ModalHeader } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAuth } from 'shared'

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
    <div>
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
      <div className="mt-6 flex items-center gap-3">
        <div className="bg-bg-500 h-[2px] w-full"></div>
        <div className="text-bg-500 shrink-0 font-medium">
          {t('orAuthenticateWith')}
        </div>
        <div className="bg-bg-500 h-[2px] w-full"></div>
      </div>
      <Button
        className="mt-6 w-full"
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
    </div>
  )
}

export default TwoFAModal
