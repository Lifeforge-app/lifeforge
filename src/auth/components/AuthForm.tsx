import React, { useContext, useState } from 'react'
import Input from '../../components/general/Input'
import AuthSignInButton from './AuthSignInButtons'
import { AuthContext } from '../../providers/AuthProvider'
import { toast } from 'react-toastify'
import { AUTH_ERROR_MESSAGES } from '../../constants/auth'

function AuthForm(): React.ReactElement {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    authenticate,
    authWithOauth,
    loginQuota: { quota, dismissQuota }
  } = useContext(AuthContext)

  function signIn(): void {
    if (emailOrUsername.length === 0 || password.length === 0) {
      toast.error(AUTH_ERROR_MESSAGES.EMPTY_FIELDS)
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
          toast.success('Welcome back, ' + res.split(' ').slice(1).join(' '))
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error(AUTH_ERROR_MESSAGES.UNKNOWN_ERROR)
      })
  }

  function signInWithGithub(): void {
    setLoading(true)
    authWithOauth('github')
      .then(res => {
        if (!res.startsWith('success')) {
          toast.error(res)
        } else {
          toast.success('Welcome back, ' + res.split(' ').slice(1).join(' '))
        }
        setLoading(false)
      })
      .catch(() => {
        toast.error(AUTH_ERROR_MESSAGES.UNKNOWN_ERROR)
      })
  }

  function updateEmailOrUsername(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setEmail(event.target.value)
  }

  function updatePassword(event: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
  }

  return (
    <div className="mt-6 flex w-full max-w-md flex-col gap-8 sm:mt-12">
      <Input
        name="Email or Username"
        placeholder="someone@somemail.com"
        icon="tabler:user"
        value={emailOrUsername}
        updateValue={updateEmailOrUsername}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            signIn()
          }
        }}
      />
      <Input
        name="Password"
        placeholder="••••••••••••••••"
        icon="tabler:key"
        isPassword
        value={password}
        updateValue={updatePassword}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            signIn()
          }
        }}
      />
      <AuthSignInButton
        emailOrUsername={emailOrUsername}
        password={password}
        loading={loading}
        signIn={signIn}
        signInWithGithub={signInWithGithub}
      />
    </div>
  )
}

export default AuthForm
