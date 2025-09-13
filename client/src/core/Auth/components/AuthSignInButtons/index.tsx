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

  return (
    <div className="mt-6 space-y-6">
      <SignInButton loading={loading} signIn={signIn} />
      {providers.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="bg-bg-500 h-[2px] w-full"></div>
            <div className="text-bg-500 shrink-0 font-medium">
              {t('orAuthenticateWith')}
            </div>
            <div className="bg-bg-500 h-[2px] w-full"></div>
          </div>
          <div className="flex w-full gap-3">
            {providers.map(provider => (
              <SigninWithProviderButton
                key={provider}
                loading={loading}
                provider={provider}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default memo(AuthSignInButton)
