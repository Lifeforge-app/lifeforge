/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'
import AuthSideImage from './components/AuthSideImage'
import AuthHeader from './components/AuthHeader'
import Input from '../components/general/Input'
import AuthSignInButton from './components/AuthSignInButtons'

function Auth(): React.JSX.Element {
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
    <>
      <section className="flex h-full w-full flex-col items-center overflow-y-auto px-12 pb-12 lg:w-1/2">
        <AuthHeader />
        <div className="mt-12 flex w-full max-w-md flex-col gap-8">
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
          <AuthSignInButton
            emailOrUsername={emailOrUsername}
            password={password}
          />
        </div>
      </section>
      <AuthSideImage />
    </>
  )
}

export default Auth
