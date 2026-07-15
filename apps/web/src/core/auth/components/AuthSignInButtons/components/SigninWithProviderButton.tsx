import _ from 'lodash'
import { memo, useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { useAuth } from '@lifeforge/api'
import { Button, toast } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

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
    try {
      const data = await forgeAPI.auth.oauth.authorize
        .input({
          provider
        })
        .queryRaw()

      sessionStorage.setItem('oauthState', data.state)
      sessionStorage.setItem('oauthProvider', provider)

      window.location.href = data.url
    } catch (err) {
      toast.error("Couldn't connect to OAuth provider")
      console.error(err)
    }
  }, [provider])

  return (
    <Button
      key={provider}
      icon={`tabler:brand-${provider}`}
      loading={
        loading ||
        auth ||
        (searchParams.get('code') !== null &&
          searchParams.get('state') !== null)
      }
      namespace={false}
      variant="secondary"
      width="100%"
      onClick={signInWithProvider}
    >
      {_.capitalize(provider)}
    </Button>
  )
}

export default memo(SigninWithProviderButton)
