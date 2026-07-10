/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'

import { APIEndpointProvider } from '@lifeforge/api'
import { I18nCommonNameSpacePreloadProvider } from '@lifeforge/localization'

import { ModalManager } from '@/components/overlays'
import { Flex, Transition } from '@/components/primitives'
import { ModalProvider } from '@/providers'

import { ToastProvider } from '../providers'
import { SBThemeProvider } from './SBThemeProvider'

export const queryClient = new QueryClient()

export function PreviewWrapper(Story: any, context: any) {
  return (
    <NuqsAdapter>
      <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
        <QueryClientProvider client={queryClient}>
          <I18nCommonNameSpacePreloadProvider>
            <Transition>
              <Flex
                align="center"
                direction="column"
                height="100%"
                id="body"
                justify="center"
                minHeight="0"
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
                          lg: '70vw',
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
            </Transition>
          </I18nCommonNameSpacePreloadProvider>
        </QueryClientProvider>
      </APIEndpointProvider>
    </NuqsAdapter>
  )
}
