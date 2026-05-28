/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { APIEndpointProvider, ToastProvider } from 'shared'

import ModalProvider from 'shared/dist/providers/ModalStoreProvider'

import { ModalManager } from '@components/overlays'
import { Flex } from '@components/primitives'

import { SBThemeProvider } from './SBThemeProvider'

export const queryClient = new QueryClient()

export function PreviewWrapper(Story: any, context: any) {
  return (
    <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
      <QueryClientProvider client={queryClient}>
        <Flex
          align="center"
          direction="column"
          height="100%"
          id="body"
          justify="center"
          minHeight="0"
          style={{ transition: 'all 0.2s' }}
        >
          <SBThemeProvider context={context}>
            <ToastProvider>
              <ModalProvider>
                <Flex
                  align="center"
                  direction="column"
                  height="100%"
                  id="app"
                  justify="center"
                  maxWidth={{
                    lg: '50vw',
                    base: '100vw'
                  }}
                  minHeight="0"
                  px="3xl"
                  width="100%"
                >
                  <Story />
                  <ModalManager />
                </Flex>
              </ModalProvider>
            </ToastProvider>
          </SBThemeProvider>
        </Flex>
      </QueryClientProvider>
    </APIEndpointProvider>
  )
}

