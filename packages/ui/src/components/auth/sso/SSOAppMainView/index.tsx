import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import {
  APIEndpointProvider,
  EncryptionProvider,
  PersonalizationProvider,
  SSOAuthProvider,
  ToastProvider
} from '@lifeforge/shared'

import { LoadingScreen } from '@/components/feedback'
import { ModalManager } from '@/components/overlays'
import { Flex } from '@/components/primitives'

import { SSOHeader } from '../SSOHeader'
import { UnauthorizedScreen } from '../UnauthorizedScreen'

export type SSOAppConfig = {
  apiEndpoint: string
  forgeAPI: any
  namespace: string
  icon: string
  link: string
  frontendURL: string
}

const queryClient = new QueryClient()

export function SSOAppMainView({
  config: { apiEndpoint, forgeAPI, namespace, icon, link, frontendURL },
  children
}: {
  config: SSOAppConfig
  children: React.ReactNode
}) {
  return (
    <APIEndpointProvider endpoint={apiEndpoint}>
      <EncryptionProvider apiHost={apiEndpoint}>
        <QueryClientProvider client={queryClient}>
          <PersonalizationProvider forgeAPI={forgeAPI}>
            <ToastProvider>
              <Flex
                as="main"
                bg={{ base: 'bg-200', dark: 'bg-900' }}
                direction="column"
                id="app"
                minHeight="100dvh"
                style={{ color: 'var(--color-bg-800)' }}
                width="100%"
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
              </Flex>
            </ToastProvider>
          </PersonalizationProvider>
        </QueryClientProvider>
      </EncryptionProvider>
    </APIEndpointProvider>
  )
}
