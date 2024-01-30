/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { type FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../providers/AuthProvider'
import { toast } from 'react-toastify'
import { AUTH_ERROR_MESSAGES } from '../constants/auth'

function Auth(): React.JSX.Element {
  const [emailOrUsername, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    auth,
    authenticate,
    authWithOauth,
    loginQuota: { quota, dismissQuota }
  } = useContext(AuthContext)

  function updateEmailOrUsername(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setEmail(event.target.value)
  }

  function updatePassword(event: React.ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
  }

  function signIn(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

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
    authWithOauth('github').then(res => {
      if (!res.startsWith('success')) {
        toast.error(res)
      } else {
        toast.success('Welcome back, ' + res.split(' ').slice(1).join(' '))
      }
      setLoading(false)
    })
  }

  return (
    <>
      <section className="flex h-full w-full flex-col items-center px-12 pb-12 lg:w-1/2 overflow-y-auto">
        <h1 className="mb-8 flex items-center gap-2 whitespace-nowrap text-3xl font-semibold mt-32">
          <Icon icon="tabler:hammer" className="text-5xl text-custom-500" />
          <div>
            LifeForge<span className="text-4xl text-custom-500"> .</span>
          </div>
        </h1>
        <h2 className="text-center text-4xl font-semibold tracking-wide sm:text-5xl">
          Welcome Back!
        </h2>
        <p className="mt-2 text-center text-base text-neutral-500 sm:mt-4 sm:text-xl">
          Sign in to continue tracking your life.
        </p>
        <form
          onSubmit={signIn}
          className="mt-12 flex w-full max-w-md flex-col gap-8"
        >
          <div className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800 focus-within:border-custom-500">
            <Icon
              icon="tabler:user"
              className="ml-6 h-6 w-6 shrink-0 group-focus-within:text-custom-500"
            />

            <div className="flex w-full items-center gap-2">
              <span
                className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide group-focus-within:text-custom-500 ${
                  emailOrUsername.length === 0
                    ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                    : 'top-6 -translate-y-1/2 text-[14px]'
                }`}
              >
                Username or Email
              </span>
              <input
                value={emailOrUsername}
                onChange={updateEmailOrUsername}
                placeholder="someone@example.com"
                className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-widest placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-500"
              />
            </div>
          </div>
          <div className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] bg-neutral-200/50 dark:bg-neutral-800 focus-within:border-custom-500">
            <Icon
              icon="tabler:key"
              className="ml-6 h-6 w-6 shrink-0 group-focus-within:text-custom-500"
            />

            <div className="flex w-full items-center gap-2">
              <span
                className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide group-focus-within:text-custom-500 ${
                  password.length === 0
                    ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                    : 'top-6 -translate-y-1/2 text-[14px]'
                }`}
              >
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={updatePassword}
                placeholder="••••••••••••••••••••"
                className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 text-xl tracking-widest placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-500"
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-6">
            <button
              type="submit"
              disabled={
                emailOrUsername.length === 0 ||
                password.length === 0 ||
                loading ||
                auth
              }
              className="flex h-[4.6rem] items-center justify-center rounded-lg bg-custom-500 p-6 font-semibold uppercase tracking-widest transition-all hover:bg-custom-600 disabled:cursor-not-allowed disabled:bg-custom-700 dark:disabled:bg-custom-900 disabled:text-neutral-200 dark:disabled:text-neutral-400 text-neutral-100"
            >
              {loading ? <Icon icon="svg-spinners:180-ring" /> : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={signInWithGithub}
              className="flex items-center justify-center gap-3 rounded-lg bg-neutral-400 dark:bg-neutral-800 p-6 font-semibold uppercase tracking-widest transition-all hover:bg-neutral-500 dark:hover:bg-neutral-700 text-neutral-100"
            >
              <Icon icon="tabler:brand-github" className="text-2xl" />
              Sign In with Github
            </button>
          </div>
        </form>
      </section>
      <section className="relative hidden h-full w-1/2 lg:flex">
        <img src="/login.jpg" alt="Login" className="h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-custom-500 to-custom-600 opacity-30" />
        <div className="absolute inset-0 bg-neutral-900/50" />
        <p className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col text-center text-5xl font-semibold tracking-wide text-neutral-100">
          <span className="mb-2 text-2xl text-custom-400">
            One day, You&apos;ll leave this world behind
          </span>
          So live a life you remember
        </p>
      </section>
    </>
  )
}

export default Auth
