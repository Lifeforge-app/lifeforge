// import * as webauthn from '@passwordless-id/webauthn'
import { useAuth } from '@providers/AuthProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TextInput } from '@lifeforge/ui'

import AuthSignInButton from './AuthSignInButtons'

function AuthForm({ providers }: { providers: string[] }) {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('common.auth')

  const {
    authenticate,
    loginQuota: { quota, dismissQuota }
  } = useAuth()

  function signIn() {
    if (emailOrUsername.length === 0 || password.length === 0) {
      toast.error(t('messages.invalidFields'))
      return
    }
    if (quota === 0) {
      dismissQuota()
      return
    }
    setLoading(true)
    authenticate({ email: emailOrUsername, password })
      .then(res => {
        if (res === '2FA required' || !res) {
          return
        }

        if (res === 'invalid') {
          toast.error(t('messages.invalidCredentials'))
          dismissQuota()
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
        setLoading(false)
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
        providers={providers}
        signIn={signIn}
      />
    </div>
  )
}

export default AuthForm
