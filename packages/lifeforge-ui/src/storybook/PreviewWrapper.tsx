/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { APIEndpointProvider, ToastProvider } from 'shared'

import ModalProvider from 'shared/dist/providers/ModalStoreProvider'

import { ModalManager } from '@components/overlays'
import { Flex } from '@components/primitives'

import { SBThemeProvider } from './SBThemeProvider'

const queryClient = new QueryClient()

function PreviewWrapper(Story: any, context: any) {
  return (
    <APIEndpointProvider endpoint={'https://lifeforge-api-proxy.onrender.com'}>
      <QueryClientProvider client={queryClient}>
        <Flex
          align="center"
          direction="column"
          height="100%"
          id="body"
          justify="center"
          style={{ transition: 'all 0.2s' }}
        >
          <SBThemeProvider context={context}>
            <ToastProvider>
              <ModalProvider>
                <main className="flex-center w-full flex-1 flex-col" id="app">
                  <Story />
                  <ModalManager />
                </main>
              </ModalProvider>
            </ToastProvider>
          </SBThemeProvider>
        </Flex>
      </QueryClientProvider>
    </APIEndpointProvider>
  )
}

export default PreviewWrapper
