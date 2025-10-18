// import * as webauthn from '@passwordless-id/webauthn'
import { TextInput } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSearchParams } from 'shared'
import { usePromiseLoading } from 'shared'
import { useAuth } from 'shared'

import AuthSignInButton from './AuthSignInButtons'

function AuthForm({ providers }: { providers: string[] }) {
  const [emailOrUsername, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const emailOrUsernameRef = useRef(emailOrUsername)

  const passwordRef = useRef(password)

  const [formDisabled, setFormDisabled] = useState(false)

  const [searchParams] = useSearchParams()

  const { t } = useTranslation('common.auth')

  const { authenticate } = useAuth()

  const INPUT_FIELDS = [
    {
      label: t('inputs.emailOrUsername.label'),
      placeholder: t('common.auth:inputs.emailOrUsername.placeholder'),
      icon: 'tabler:user',
      value: emailOrUsername,
      setValue: setEmail,
      inputMode: 'email'
    },
    {
      label: t('inputs.password.label'),
      placeholder: '••••••••••••••••',
      icon: 'tabler:key',
      value: password,
      setValue: setPassword
    }
  ] as const

  const signIn = useCallback(async () => {
    const emailOrUsername = emailOrUsernameRef.current

    const password = passwordRef.current

    if (emailOrUsername.length === 0 || password.length === 0) {
      toast.error(t('messages.invalidFields'))

      return
    }

    setFormDisabled(true)

    await authenticate({ email: emailOrUsername, password })
      .then(res => {
        if (res === '2FA required' || !res) {
          return
        }

        if (res === 'invalid') {
          toast.error(t('messages.invalidCredentials'))

          return
        }

        if (res.startsWith('success')) {
          toast.success(
            t('messages.welcomeBack', {
              name: res.split(' ').slice(1).join(' ')
            })
          )
        } else {
          throw new Error()
        }
      })
      .catch(() => {
        toast.error(t(`messages.unknownError`))
      })
      .finally(() => {
        setFormDisabled(false)
      })
  }, [authenticate, t])

  const [loading, onSubmit] = usePromiseLoading(signIn)

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit()
      }
    },
    [onSubmit]
  )

  useEffect(() => {
    emailOrUsernameRef.current = emailOrUsername
  }, [emailOrUsername])

  useEffect(() => {
    passwordRef.current = password
  }, [password])

  return (
    <div className="mt-6 flex w-full max-w-md flex-col gap-6 sm:mt-12">
      {INPUT_FIELDS.map((input, index) => (
        <TextInput
          key={index}
          {...input}
          disabled={
            formDisabled ||
            (searchParams.get('code') !== null &&
              searchParams.get('state') !== null)
          }
          isPassword={index === 1}
          onKeyDown={onInputKeyDown}
        />
      ))}
      <AuthSignInButton
        loading={loading}
        providers={providers}
        signIn={onSubmit}
      />
    </div>
  )
}

export default AuthForm
