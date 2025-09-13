import { Icon } from '@iconify/react'
import { useAuth } from '@providers/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ModalManager, WithQuery } from 'lifeforge-ui'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import AuthForm from './components/AuthForm'
import AuthHeader from './components/AuthHeader'
import AuthSideImage from './components/AuthSideImage'

function Auth() {
  const { verifyOAuth } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()

  const oauthProvidersQuery = useQuery(
    forgeAPI.user.oauth.listProviders.queryOptions()
  )

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
    <WithQuery query={oauthProvidersQuery}>
      {providers => (
        <>
          <section className="flex-center size-full flex-col overflow-y-auto px-8 pt-12 pb-4 sm:px-12 lg:w-1/2">
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
          <ModalManager />
        </>
      )}
    </WithQuery>
  )
}

export default Auth
