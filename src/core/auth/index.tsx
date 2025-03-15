import { Icon } from '@iconify/react'
import { useAuth } from '@providers/AuthProvider'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import { QueryWrapper } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import AuthForm from './components/AuthForm'
import AuthHeader from './components/AuthHeader'
import AuthSideImage from './components/AuthSideImage'
import TwoFAModal from './components/TwoFAModal/TwoFAModal'

function Auth() {
  const { verifyOAuth } = useAuth()
  const [searchParams] = useSearchParams()
  const oauthProvidersQuery = useAPIQuery<string[]>(
    '/user/auth/oauth-providers',
    ['auth', 'oauth', 'providers']
  )

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) return

    verifyOAuth(code, state)
  }, [searchParams])

  return (
    <QueryWrapper query={oauthProvidersQuery}>
      {providers => (
        <>
          <section className="flex-center size-full flex-col overflow-y-auto px-8 pb-4 pt-12 sm:px-12 lg:w-1/2">
            <div className="flex-center size-full flex-col">
              <AuthHeader />
              <AuthForm providers={providers} />
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              <div className="text-bg-500 flex items-center gap-2">
                <Icon className="size-6" icon="tabler:creative-commons" />
                <Icon className="size-6" icon="tabler:creative-commons-by" />
                <Icon className="size-6" icon="tabler:creative-commons-nc" />
                <Icon className="size-6" icon="tabler:creative-commons-sa" />
              </div>
              <p className="text-bg-500 text-center text-sm">
                A project by{' '}
                <a
                  className="text-custom-500 underline"
                  href="https://melvinchia.dev"
                  rel="noreferrer"
                  target="_blank"
                >
                  Melvin Chia
                </a>{' '}
                licensed under{' '}
                <a
                  className="text-custom-500 underline"
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  rel="noreferrer"
                  target="_blank"
                >
                  CC BY-NC-SA 4.0
                </a>
                .
              </p>
            </div>
          </section>
          <AuthSideImage />
          <TwoFAModal />
        </>
      )}
    </QueryWrapper>
  )
}

export default Auth
