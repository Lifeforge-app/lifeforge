import React, { useContext } from 'react'
import { AuthContext } from '../../providers/AuthProvider'
import { Icon } from '@iconify/react/dist/iconify.js'

function AuthSignInButton({
  emailOrUsername,
  password,
  loading,
  signIn,
  signInWithGithub
}: {
  emailOrUsername: string
  password: string
  loading: boolean
  signIn: () => void
  signInWithGithub: () => void
}): React.ReactElement {
  const { auth } = useContext(AuthContext)

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
        className="flex h-[4.6rem] items-center justify-center rounded-lg bg-custom-500 p-6 font-semibold uppercase tracking-widest text-bg-100 transition-all hover:bg-custom-600 disabled:cursor-not-allowed disabled:bg-custom-700 disabled:text-bg-200 dark:disabled:bg-custom-900 dark:disabled:text-bg-500"
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
