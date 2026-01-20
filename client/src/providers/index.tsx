import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EncryptionWrapper, useModalStore } from 'lifeforge-ui'
import { APIOnlineStatusWrapper } from 'lifeforge-ui'
import { useMemo } from 'react'
import {
  APIEndpointProvider,
  APIOnlineStatusProvider,
  AuthProvider,
  BackgroundProvider,
  EncryptionProvider,
  FederationProvider,
  MainSidebarStateProvider,
  NuqsProvider,
  PersonalizationProvider,
  SocketProvider,
  ToastProvider
} from 'shared'

import TwoFAModal from '@/core/auth/modals/TwoFAModal'
import CoreFederationProvider from '@/federation/providers/CoreFederationProvider'
import forgeAPI from '@/forgeAPI'
import AppRoutesProvider from '@/routes/providers/AppRoutesProvider'

import ExternalModuleProviders from './features/ExternalModuleProviders'
import UserPersonalizationProvider from './features/UserPersonalizationProvider'
import { constructComponentTree, defineProviders } from './utils/providerUtils'

const queryClient = new QueryClient()

function Providers() {
  const { open } = useModalStore()

  const providers = useMemo(
    () =>
      // IMPORTANT: The order of these providers matters!
      // From top to bottom, they are nested inside one another in that order.
      defineProviders([
        // Providers from external packages
        [NuqsProvider],
        [QueryClientProvider, { client: queryClient }],
        [ToastProvider],

        // Provider that tells components the API endpoint to use
        [APIEndpointProvider, { endpoint: import.meta.env.VITE_API_HOST }],

        // Provider that initializes end-to-end encryption (fetches server public key)
        [EncryptionProvider, { apiHost: import.meta.env.VITE_API_HOST }],
        [EncryptionWrapper],

        // Provider that stores all the theming information
        [PersonalizationProvider, { forgeAPI }],

        // Provider that checks if the API is online or not
        // A wrapper exported from lifeforge-ui is used to avoid circular dependencies
        [
          APIOnlineStatusProvider,
          {
            clientEnvironment: (import.meta.env.DEV
              ? 'development'
              : 'production') as 'development' | 'production' | null
          }
        ],
        [APIOnlineStatusWrapper],

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
