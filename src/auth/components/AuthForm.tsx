// import * as webauthn from '@passwordless-id/webauthn'
import { AUTH_ERROR_MESSAGES } from '@constants/auth'
import { useAuthContext } from '@providers/AuthProvider'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TextInput } from '@lifeforge/ui'

import AuthSignInButton from './AuthSignInButtons'

function AuthForm(): React.ReactElement {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('common.auth')

  const {
    authenticate,
    loginQuota: { quota, dismissQuota }
  } = useAuthContext()

  function signIn(): void {
    if (emailOrUsername.length === 0 || password.length === 0) {
      toast.error(t(AUTH_ERROR_MESSAGES.EMPTY_FIELDS))
      return
    }
    if (quota === 0) {
      dismissQuota()
      return
    }
    setLoading(true)
    authenticate({ email: emailOrUsername, password })
      .then(res => {
        if (!res.startsWith('success')) {
          toast.error(res)
          if (res === AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS) {
            dismissQuota()
          }
        } else {
          toast.success(t('welcome') + res.split(' ').slice(1).join(' '))
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error(t(AUTH_ERROR_MESSAGES.UNKNOWN_ERROR))
      })
  }

  return (
    <div className="mt-6 flex w-full max-w-md flex-col gap-6 sm:mt-12">
      {(
        [
          {
            name: t('inputs.emailOrUsername.label'),
            placeholder: t('common.auth:inputs.emailOrUsername.placeholder'),
            icon: 'tabler:user',
            value: emailOrUsername,
            setValue: setEmail,
            inputMode: 'email'
          },
          {
            name: t('inputs.password.label'),
            placeholder: '••••••••••••••••',
            icon: 'tabler:key',
            value: password,
            setValue: setPassword
          }
        ] as const
      ).map((input, index) => (
        <TextInput
          key={index}
          {...input}
          darker
          isPassword={input.name === 'Password'}
          namespace={false}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              signIn()
            }
          }}
        />
      ))}
      <AuthSignInButton
        emailOrUsername={emailOrUsername}
        loading={loading}
        password={password}
        signIn={signIn}
      />
    </div>
  )
}

export default AuthForm
