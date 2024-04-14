import React, { useContext, useState } from 'react'
import Input from '@components/Input'
import AuthSignInButton from './AuthSignInButtons'
import { AuthContext } from '@providers/AuthProvider'
import { toast } from 'react-toastify'
import { AUTH_ERROR_MESSAGES } from '../../constants/auth'
import * as webauthn from '@passwordless-id/webauthn'

function AuthForm(): React.ReactElement {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    setAuth,
    setUserData,
    authenticate,
    loginQuota: { quota, dismissQuota },
    verifyToken
  } = useContext(AuthContext)

  async function fetchPassKeyChallenge(): Promise<string> {
    return await fetch(
      `${import.meta.env.VITE_API_HOST}/user/passkey/challenge`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          return data.data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Couldn’t fetch the challenge. Please try again.')
        console.error(err)
      })
  }

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

  async function registerWithPasskey(): Promise<void> {
    const res = await webauthn.client.register(
      'melvinchia623600@gmail.com',
      '20e47b44-293a-417a-8559-d7f32affd8b4',
      {
        authenticatorType: 'both',
        userVerification: 'required',
        discoverable: 'preferred',
        timeout: 60000,
        attestation: true
      }
    )

    await fetch(`${import.meta.env.VITE_API_HOST}/user/passkey/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(res)
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          toast.success('Passkey created successfully')
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Couldn't create the passkey. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  async function signInWithPasskey(): Promise<void> {
    setLoading(true)
    const challenge = await fetchPassKeyChallenge()

    const res = await webauthn.client.authenticate([], challenge)

    await fetch(`${import.meta.env.VITE_API_HOST}/user/passkey/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(res)
    })
      .then(async res => {
        const data = await res.json()

        if (res.ok && data.state === 'success') {
          document.cookie = `token=${data.token}; path=/; expires=${new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString()}`

          verifyToken(data.token)
            .then(async ({ success, userData }) => {
              if (success) {
                setUserData(userData)
                setAuth(true)

                toast.success(`Welcome back, ${userData.name}!`)
              }
            })
            .catch(() => {
              setAuth(false)
            })
            .finally(() => {
              setLoading(false)
            })
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(
          'Failed to authenticate with the passkey. Please try again.'
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
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
        darker
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
        darker
      />
      <AuthSignInButton
        emailOrUsername={emailOrUsername}
        password={password}
        loading={loading}
        signIn={signIn}
        signInWithPasskey={signInWithPasskey}
      />
    </div>
  )
}

export default AuthForm
