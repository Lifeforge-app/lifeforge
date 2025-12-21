import QRLoginModal from '@/auth/modals/QRLoginModal'
import { Button, useModalStore } from 'lifeforge-ui'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import SignInButton from './components/SignInButton'
import SigninWithProviderButton from './components/SigninWithProviderButton'

function AuthSignInButton({
  loading,
  signIn,
  providers
}: {
  loading: boolean
  signIn: () => void
  providers: string[]
}) {
  const { t } = useTranslation('common.auth')

  const open = useModalStore(state => state.open)

  return (
    <div className="mt-6 space-y-3">
      <SignInButton loading={loading} signIn={signIn} />
      <div className="my-6! flex items-center gap-3">
        <div className="bg-bg-400 dark:bg-bg-700 h-[1.5px] w-full"></div>
        <div className="text-bg-400 dark:text-bg-700 shrink-0 font-medium">
          {t('orAuthenticateWith')}
        </div>
        <div className="bg-bg-400 dark:bg-bg-700 h-[1.5px] w-full"></div>
      </div>
      {providers.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-3">
          {providers.map(provider => (
            <SigninWithProviderButton
              key={provider}
              loading={loading}
              provider={provider}
            />
          ))}
        </div>
      )}
      <Button
        className="w-full"
        icon="tabler:qrcode"
        namespace="common.auth"
        variant="secondary"
        onClick={() => open(QRLoginModal, {})}
      >
        qrLogin.title
      </Button>
    </div>
  )
}

export default memo(AuthSignInButton)
