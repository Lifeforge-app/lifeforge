import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  SSOAuthProvider,
  ToastProvider
} from 'shared'

import { LoadingScreen } from '@components/screens'

import { ModalManager } from '../..'
import SSOHeader from './SSOHeader'
import UnauthorizedScreen from './UnauthorizedScreen'

export type SSOAppConfig = {
  apiEndpoint: string
  forgeAPI: any
  namespace: string
  icon: string
  link: string
  frontendURL: string
}

const queryClient = new QueryClient()

function SSOAppMainView({
  config: { apiEndpoint, forgeAPI, namespace, icon, link, frontendURL },
  children
}: {
  config: SSOAppConfig
  children: React.ReactNode
}) {
  return (
    <APIEndpointProvider endpoint={apiEndpoint}>
      <QueryClientProvider client={queryClient}>
        <PersonalizationProvider>
          <ToastProvider>
            <main
              className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex min-h-dvh w-full flex-col"
              id="app"
            >
              <SSOAuthProvider forgeAPI={forgeAPI}>
                {isAuthed =>
                  isAuthed === 'loading' ? (
                    <LoadingScreen />
                  ) : isAuthed ? (
                    children
                  ) : (
                    <>
                      <SSOHeader
                        icon={icon}
                        link={link}
                        namespace={namespace}
                      />
                      <UnauthorizedScreen frontendURL={frontendURL} />
                    </>
                  )
                }
              </SSOAuthProvider>
              <ModalManager />
            </main>
          </ToastProvider>
        </PersonalizationProvider>
      </QueryClientProvider>
    </APIEndpointProvider>
  )
}

export default SSOAppMainView
