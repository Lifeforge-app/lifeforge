/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthContext } from '@providers/AuthProvider'
import AuthForm from './components/AuthForm'
import AuthHeader from './components/AuthHeader'
import AuthSideImage from './components/AuthSideImage'

function Auth(): React.ReactElement {
  const { verifyOAuth } = useAuthContext()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) return
    verifyOAuth(code, state)
  }, [searchParams])

  return (
    <>
      <section className="flex-center flex size-full flex-col overflow-y-auto px-8 pb-4 pt-12 sm:px-12 lg:w-1/2">
        <div className="flex-center flex size-full flex-col">
          <AuthHeader />
          <AuthForm />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-bg-500">
            <Icon icon="tabler:creative-commons" className="size-6" />
            <Icon icon="tabler:creative-commons-by" className="size-6" />
            <Icon icon="tabler:creative-commons-nc" className="size-6" />
            <Icon icon="tabler:creative-commons-sa" className="size-6" />
          </div>
          <p className="text-center text-sm text-bg-500">
            A project by{' '}
            <a
              className="text-custom-500 underline"
              target="_blank"
              href="https://thecodeblog.net"
              rel="noreferrer"
            >
              Melvin Chia
            </a>{' '}
            licensed under{' '}
            <a
              className="text-custom-500 underline"
              target="_blank"
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              rel="noreferrer"
            >
              CC BY-NC-SA 4.0
            </a>
            .
          </p>
        </div>
      </section>
      <AuthSideImage />
    </>
  )
}

export default Auth
