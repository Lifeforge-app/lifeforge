/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18next from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { initReactI18next } from 'react-i18next'

import { APIEndpointProvider } from '@lifeforge/api'
import {
  I18nCommonNameSpacePreloadProvider,
  I18nInitProvider,
  setI18n
} from '@lifeforge/localization'

import { ErrorScreen, LoadingScreen } from '@/components'
import { ModalManager } from '@/components/overlays'
import { Flex, Transition } from '@/components/primitives'
import { ModalProvider } from '@/providers'

import { i18nConfig } from '../../.storybook/i18n'
import { ToastProvider } from '../providers'
import { SBThemeProvider } from './SBThemeProvider'

export const queryClient = new QueryClient()

export function PreviewWrapper(Story: any, context: any) {
  return (
    <I18nInitProvider
      errorFallback={<ErrorScreen message="Failed to initialize i18n" />}
      init={async () => {
        await i18next
          .use(I18NextHttpBackend)
          .use(initReactI18next)
          .init(i18nConfig)

        setI18n(i18next)
      }}
      loadingFallback={<LoadingScreen message="Loading i18n..." />}
    >
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
    </I18nInitProvider>
  )
}
