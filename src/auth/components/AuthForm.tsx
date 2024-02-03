import React, { useState } from 'react'
import Input from '../../components/general/Input'
import AuthSignInButton from './AuthSignInButtons'

function AuthForm(): React.ReactElement {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function updateEmailOrUsername(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setEmail(event.target.value)
  }

  function updatePassword(event: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
  }

  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-8 sm:mt-12">
      <Input
        name="Email or Username"
        placeholder="someone@somemail.com"
        icon="tabler:user"
        value={emailOrUsername}
        updateValue={updateEmailOrUsername}
      />
      <Input
        name="Password"
        placeholder="••••••••••••••••"
        icon="tabler:key"
        isPassword
        value={password}
        updateValue={updatePassword}
      />
      <AuthSignInButton emailOrUsername={emailOrUsername} password={password} />
    </div>
  )
}

export default AuthForm
