import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
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
        iconAtEnd
        className="w-full"
        icon="tabler:arrow-right"
        loading={loading || auth}
        namespace="common.auth"
        onClick={signIn}
      >
        Sign In
      </Button>
      <div className="flex items-center gap-3">
        <div className="bg-bg-500 h-[2px] w-full"></div>
        <div className="text-bg-500 shrink-0 font-medium">
          {t('orSignInWith')}
        </div>
        <div className="bg-bg-500 h-[2px] w-full"></div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          className="w-full"
          icon="uil:github"
          loading={
            loading ||
            auth ||
            (searchParams.get('code') !== null &&
              searchParams.get('state') !== null)
          }
          variant="secondary"
          onClick={() => {
            signInWithProvider('github').catch(console.error)
          }}
        >
          Github
        </Button>
        <Button
          className="w-full"
          icon="uil:google"
          loading={
            loading ||
            auth ||
            (searchParams.get('code') !== null &&
              searchParams.get('state') !== null)
          }
          variant="secondary"
          onClick={() => {
            signInWithProvider('google').catch(console.error)
          }}
        >
          Google
        </Button>
      </div>
    </div>
  )
}

export default AuthSignInButton
