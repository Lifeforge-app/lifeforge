import React, { type FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import { toast } from 'react-toastify'
import { AUTH_ERROR_MESSAGES } from '../../constants/auth'
import { Icon } from '@iconify/react/dist/iconify.js'

function AuthSignInButton({
  emailOrUsername,
  password
}: {
  emailOrUsername: string
  password: string
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const {
    auth,
    authenticate,
    authWithOauth,
    loginQuota: { quota, dismissQuota }
  } = useContext(AuthContext)

  function signIn(): void {
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
        className="flex h-[4.6rem] items-center justify-center rounded-lg bg-custom-500 p-6 font-semibold uppercase tracking-widest text-bg-100 transition-all hover:bg-custom-600 disabled:cursor-not-allowed disabled:bg-custom-700 disabled:text-bg-200 dark:disabled:bg-custom-900 dark:disabled:text-bg-400"
      >
        {loading ? <Icon icon="svg-spinners:180-ring" /> : 'Sign In'}
      </button>
      <button
        type="button"
        onClick={signInWithGithub}
        className="flex items-center justify-center gap-3 rounded-lg bg-bg-400 p-6 font-semibold uppercase tracking-widest text-bg-100 transition-all hover:bg-bg-500 dark:bg-bg-800 dark:hover:bg-bg-700"
      >
        <Icon icon="tabler:brand-github" className="text-2xl" />
        Sign In with Github
      </button>
    </div>
  )
}

export default AuthSignInButton
