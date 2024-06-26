import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import { useAuthContext } from '@providers/AuthProvider'

function AuthSignInButton({
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
    <div className="mt-6 space-y-6">
      <Button
        loading={loading || auth}
        iconAtEnd
        onClick={signIn}
        icon="tabler:arrow-right"
        className="w-full"
      >
        sign in
      </Button>
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-full bg-bg-600"></div>
        <div className="shrink-0 font-medium text-bg-600">{t('auth.or')}</div>
        <div className="h-[2px] w-full bg-bg-600"></div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          onClick={signInWithPasskey}
          loading={loading || auth}
          icon="tabler:key"
          variant="secondary"
          className="w-full"
        >
          sign in with passkey
        </Button>
      </div>
    </div>
  )
}

export default AuthSignInButton
