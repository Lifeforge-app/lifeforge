import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@components/buttons/Button'
import { useAuthContext } from '@providers/AuthProvider'

function AuthSignInButton({
  loading,
  signIn
}: {
  emailOrUsername: string
  password: string
  loading: boolean
  signIn: () => void
}): React.ReactElement {
  const { auth } = useAuthContext()
  const { t } = useTranslation('common.auth')
  const [searchParams] = useSearchParams()

  async function signInWithProvider(providerName: string): Promise<void> {
    const provider = await fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/user/auth/oauth-endpoint?provider=${providerName}`
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          return data.data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Couldn't fetch provider data")
        console.error(err)
      })

    if (!provider) return

    localStorage.setItem('authState', provider.state)
    localStorage.setItem('authProvider', providerName)

    window.location.href = provider.authUrl + `${window.location.origin}/auth`
  }

  return (
    <div className="mt-6 space-y-6">
      <Button
        loading={loading || auth}
        iconAtEnd
        onClick={signIn}
        icon="tabler:arrow-right"
        className="w-full"
        namespace="common.auth"
      >
        Sign In
      </Button>
      <div className="flex items-center gap-3">
        <div className="h-[2px] w-full bg-bg-500"></div>
        <div className="shrink-0 font-medium text-bg-500">
          {t('orSignInWith')}
        </div>
        <div className="h-[2px] w-full bg-bg-500"></div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          onClick={() => {
            signInWithProvider('github').catch(console.error)
          }}
          loading={
            loading ||
            auth ||
            (searchParams.get('code') !== null &&
              searchParams.get('state') !== null)
          }
          icon="uil:github"
          variant="secondary"
          className="w-full"
        >
          Github
        </Button>
        <Button
          onClick={() => {
            signInWithProvider('google').catch(console.error)
          }}
          loading={
            loading ||
            auth ||
            (searchParams.get('code') !== null &&
              searchParams.get('state') !== null)
          }
          icon="uil:google"
          variant="secondary"
          className="w-full"
        >
          Google
        </Button>
      </div>
    </div>
  )
}

export default AuthSignInButton
