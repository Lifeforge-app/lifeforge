/* eslint-disable react-compiler/react-compiler */
import { useAuth } from '@providers/AuthProvider'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

function AuthSignInButton({
  loading,
  signIn,
  providers
}: {
  emailOrUsername: string
  password: string
  loading: boolean
  signIn: () => void
  providers: string[]
}) {
  const { auth } = useAuth()
  const { t } = useTranslation('common.auth')
  const [searchParams] = useSearchParams()

  async function signInWithProvider(providerName: string) {
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
      {providers.length && (
        <>
          <div className="flex items-center gap-3">
            <div className="bg-bg-500 h-[2px] w-full"></div>
            <div className="text-bg-500 shrink-0 font-medium">
              {t('orAuthenticateWith')}
            </div>
            <div className="bg-bg-500 h-[2px] w-full"></div>
          </div>
          <div className="flex w-full gap-4">
            {providers.map(provider => (
              <Button
                key={provider}
                className="w-full"
                icon={`uil:${provider}`}
                loading={
                  loading ||
                  auth ||
                  (searchParams.get('code') !== null &&
                    searchParams.get('state') !== null)
                }
                variant="secondary"
                onClick={() => {
                  signInWithProvider(provider).catch(console.error)
                }}
              >
                {_.capitalize(provider)}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AuthSignInButton
