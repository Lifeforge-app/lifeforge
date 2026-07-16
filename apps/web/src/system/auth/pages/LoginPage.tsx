import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { useAuth } from '@lifeforge/api'
import { ModalManager, Stack, WithQueryData, toast } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import AuthFooter from '../components/AuthFooter'
import AuthForm from '../components/AuthForm'
import AuthHeader from '../components/AuthHeader'
import AuthSideImage from '../components/AuthSideImage'

function LoginPage() {
  const { verifyOAuth } = useAuth()
  const { t } = useTranslation('common.auth')
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) return

    verifyOAuth(code, state).then(result => {
      if (!result) {
        setSearchParams({})

        return
      }


      if (result.startsWith('success')) {
        toast.success(
          t('messages.welcomeBack', {
            name: result.split(' ').slice(1).join(' ')
          })
        )
      }
    })
  }, [searchParams])

  return (
    <WithQueryData contract={forgeAPI.auth.oauth.providers.listEnabled}>
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
              <AuthForm providers={providers.map(p => p.provider)} />
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
