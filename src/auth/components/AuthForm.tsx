/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import * as webauthn from '@passwordless-id/webauthn'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Input from '@components/ButtonsAndInputs/Input'
import { AUTH_ERROR_MESSAGES } from '@constants/auth'
import { useAuthContext } from '@providers/AuthProvider'
import AuthSignInButton from './AuthSignInButtons'

function AuthForm(): React.ReactElement {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

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
          toast.success(t('auth.welcome') + res.split(' ').slice(1).join(' '))
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error(t(AUTH_ERROR_MESSAGES.UNKNOWN_ERROR))
      })
  }

  return (
    <div className="mt-6 flex w-full max-w-md flex-col gap-6 sm:mt-12">
      {[
        {
          name: t('auth.emailOrUsername'),
          placeholder: 'someone@somemail.com',
          icon: 'tabler:user',
          value: emailOrUsername,
          updateValue: setEmail
        },
        {
          name: t('auth.password'),
          placeholder: '••••••••••••••••',
          icon: 'tabler:key',
          value: password,
          updateValue: setPassword
        }
      ].map((input, index) => (
        <Input
          key={index}
          {...input}
          needTranslate={false}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              signIn()
            }
          }}
          isPassword={input.name === 'Password'}
          darker
        />
      ))}
      <AuthSignInButton
        emailOrUsername={emailOrUsername}
        password={password}
        loading={loading}
        signIn={signIn}
      />
    </div>
  )
}

export default AuthForm
