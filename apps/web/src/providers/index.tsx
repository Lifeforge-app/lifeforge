import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useMemo } from 'react'

import {
  APIEndpointProvider,
  APIOnlineStatusProvider,
  AuthProvider,
  EncryptionProvider,
  SocketProvider,
  setForgeMutationErrorHandler
} from '@lifeforge/api'
import { FederationProvider } from '@lifeforge/federation'
import { I18nInitProvider } from '@lifeforge/localization'
import {
  APIOnlineStatusWrapper,
  BackgroundProvider,
  EncryptionWrapper,
  ErrorScreen,
  LoadingScreen,
  MainSidebarStateProvider,
  PersonalizationProvider,
  ToastProvider,
  toast,
  useModalStore
} from '@lifeforge/ui'

import TwoFAModal from '@/core/auth/modals/TwoFAModal'
import CoreFederationProvider from '@/federation/providers/CoreFederationProvider'
import forgeAPI from '@/forgeAPI'
import { initI18n } from '@/i18n'
import AppRoutesProvider from '@/routes/providers/AppRoutesProvider'

import ExternalModuleProviders from './features/ExternalModuleProviders'
import I18nCommonNameSpacePreloadProvider from './features/I18nCommonNameSpacePreloadProvider'
import UserPersonalizationProvider from './features/UserPersonalizationProvider'
import { constructComponentTree, defineProviders } from './utils/providerUtils'

const queryClient = new QueryClient()

setForgeMutationErrorHandler(msg => toast.error(msg))

function Providers() {
  const { open } = useModalStore()

  const providers = useMemo(
    () =>
      // IMPORTANT: The order of these providers matters!
      // From top to bottom, they are nested inside one another in that order.
      defineProviders([
        // Providers from external packages
        [NuqsAdapter],
        [QueryClientProvider, { client: queryClient }],
        [ToastProvider],

        // Provider that tells components the API endpoint to use
        [APIEndpointProvider, { endpoint: import.meta.env.VITE_API_HOST }],

        // Provider that stores all the theming information
        [PersonalizationProvider, { forgeAPI }],

        // Provider that checks if the API is online or not
        // A wrapper exported from @lifeforge/ui is used to avoid circular dependencies
        [
          APIOnlineStatusProvider,
          {
            clientEnvironment: (import.meta.env.DEV
              ? 'development'
              : 'production') as 'development' | 'production' | null
          }
        ],
        [APIOnlineStatusWrapper],

        // Provider that makes sure the localization service is properly instantiated
        [
          I18nInitProvider,
          {
            errorFallback: (
              <ErrorScreen message="Failed to initialized localization service. Please check your i18n config." />
            ),

            init: initI18n,
            loadingFallback: (
              <LoadingScreen message="Initializing localization..." />
            )
          }
        ],

        // Provider that initializes end-to-end encryption (fetches server public key)
        [EncryptionProvider, { apiHost: import.meta.env.VITE_API_HOST }],
        [EncryptionWrapper],

        // Provider that handles authentication, very obviously
        [
          AuthProvider,
          {
            forgeAPI,
            onTwoFAModalOpen: () => {
              open(TwoFAModal, {})
            }
          }
        ],
        // Provider that manages the main sidebar state (not the module sidebars, the main one)
        [MainSidebarStateProvider],
        // Provider that synchronizes user personalization data with the backend
        [UserPersonalizationProvider],
        // Post-processing for preloaded common namesapce, splitting into multiple subnamespaces
        [I18nCommonNameSpacePreloadProvider],
        // Provider that manages background images styling
        [BackgroundProvider],
        // Provider that exposes a socket.io client instance to the app
        [SocketProvider],
        // Provider that loads federated modules (routes and global providers)
        [FederationProvider],
        [CoreFederationProvider],
        // GlobalProviders from federated modules
        // (loaded dynamically via ./GlobalProvider export in each module)
        [ExternalModuleProviders],
        // This is where all the routes are defined
        [AppRoutesProvider]
      ] as const),
    []
  )

  return constructComponentTree(providers)
}

export default Providers
