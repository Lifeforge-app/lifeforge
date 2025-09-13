import forgeAPI from '@utils/forgeAPI'
import { Button } from 'lifeforge-ui'
import _ from 'lodash'
import { memo, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { useAuth } from '../../../../providers/AuthProvider'

function SigninWithProviderButton({
  provider,
  loading
}: {
  provider: string
  loading: boolean
}) {
  const { auth } = useAuth()

  const [searchParams] = useSearchParams()

  const signInWithProvider = useCallback(async () => {
    const providerInstance = await fetch(
      forgeAPI.user.oauth.getEndpoint.input({
        provider
      }).endpoint
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

    if (!providerInstance) return

    localStorage.setItem('authState', providerInstance.state)
    localStorage.setItem('authProvider', provider)

    window.location.href =
      providerInstance.authUrl + `${window.location.origin}/auth`
  }, [provider])

  return (
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
      onClick={signInWithProvider}
    >
      {_.capitalize(provider)}
    </Button>
  )
}

export default memo(SigninWithProviderButton)
