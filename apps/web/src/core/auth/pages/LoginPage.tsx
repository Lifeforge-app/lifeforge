import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import { useAuth } from '@lifeforge/api'
import { ModalManager, Stack, WithQueryData } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import AuthFooter from '../components/AuthFooter'
import AuthForm from '../components/AuthForm'
import AuthHeader from '../components/AuthHeader'
import AuthSideImage from '../components/AuthSideImage'

function LoginPage() {
  const { verifyOAuth } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')

    const state = searchParams.get('state')

    if (!code || !state) return

    verifyOAuth(code, state).then(state => {
      if (!state) {
        setSearchParams({})
      }
    })
  }, [searchParams])

  return (
    <WithQueryData contract={forgeAPI.user.oauth.listProviders}>
      {providers => (
        <>
          <Stack
            as="section"
            overflowY="auto"
            pb="lg"
            pt="2xl"
            px={{ base: 'xl', sm: '2xl' }}
            width={{ base: '100%', lg: '50%' }}
          >
            <Stack centered height="100%">
              <AuthHeader />
              <AuthForm providers={providers} />
            </Stack>
            <AuthFooter />
          </Stack>
          <AuthSideImage />
          <ModalManager />
        </>
      )}
    </WithQueryData>
  )
}

export default LoginPage
