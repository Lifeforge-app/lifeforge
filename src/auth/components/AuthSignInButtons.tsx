import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@providers/AuthProvider'
import Button from '@components/ButtonsAndInputs/Button'

function AuthSignInButton({
  emailOrUsername,
  password,
  loading,
  signIn,
  signInWithPasskey
}: {
  emailOrUsername: string
  password: string
  loading: boolean
  signIn: () => void
  signInWithPasskey: () => void
}): React.ReactElement {
  const { auth } = useAuthContext()
  const { t } = useTranslation()

  return (
    <div className="mt-6 flex flex-col gap-6">
      <Button
        disabled={
          emailOrUsername.length === 0 ||
          password.length === 0 ||
          loading ||
          auth
        }
        onClick={signIn}
        icon={loading ? 'svg-spinners:180-ring' : undefined}
      >
        {t('auth.signInButton')}
      </Button>
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-full bg-bg-600"></div>
        <div className="shrink-0 font-medium text-bg-600">{t('auth.or')}</div>
        <div className="h-[2px] w-full bg-bg-600"></div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          onClick={signInWithPasskey}
          disabled={loading || auth}
          icon={loading ? 'svg-spinners:180-ring' : 'tabler:key'}
          type="secondary"
          className="w-full"
        >
          {t('auth.signInWithPasskey')}
        </Button>
      </div>
    </div>
  )
}

export default AuthSignInButton
