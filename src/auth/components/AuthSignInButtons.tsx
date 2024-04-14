/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '@providers/AuthProvider'

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
  const { auth } = useContext(AuthContext)
  const { t } = useTranslation()

  return (
    <div className="mt-6 flex flex-col gap-6">
      <button
        disabled={
          emailOrUsername.length === 0 ||
          password.length === 0 ||
          loading ||
          auth
        }
        onClick={signIn}
        className="flex h-[4.6rem] items-center justify-center rounded-lg bg-custom-500 p-6 font-semibold uppercase tracking-widest text-bg-100 transition-all hover:bg-custom-600 disabled:cursor-not-allowed disabled:bg-custom-700 disabled:text-bg-200 dark:disabled:bg-custom-900 dark:disabled:text-bg-500"
      >
        {loading ? (
          <Icon icon="svg-spinners:180-ring" />
        ) : (
          t('auth.signInButton')
        )}
      </button>
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-full bg-bg-600"></div>
        <div className="shrink-0 font-medium text-bg-600">{t('auth.or')}</div>
        <div className="h-[2px] w-full bg-bg-600"></div>
      </div>
      <div className="flex w-full gap-4">
        <button
          type="button"
          onClick={signInWithPasskey}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-bg-400 p-6 font-semibold uppercase tracking-widest text-bg-100 transition-all hover:bg-bg-500 dark:bg-bg-800 dark:hover:bg-bg-700"
        >
          <Icon icon="tabler:key" className="text-2xl" />
          {t('auth.signInWithPasskey')}
        </button>
      </div>
    </div>
  )
}

export default AuthSignInButton
