import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { BackendFactory } from 'dnd-core'
import { useModalStore } from 'lifeforge-ui'
import { APIOnlineStatusWrapper } from 'lifeforge-ui'
import { useMemo } from 'react'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  APIEndpointProvider,
  APIOnlineStatusProvider,
  AuthProvider,
  BackgroundProvider,
  EncryptionProvider,
  MainSidebarStateProvider,
  NuqsProvider,
  PersonalizationProvider,
  SocketProvider,
  ToastProvider
} from 'shared'

import TwoFAModal from '@/auth/modals/TwoFAModal'
import AppRoutesProvider from '@/routes/providers/AppRoutesProvider'
import forgeAPI from '@/utils/forgeAPI'

import UserPersonalizationProvider from './features/UserPersonalizationProvider'
import { constructComponentTree, defineProviders } from './utils/providerUtils'

const queryClient = new QueryClient()

// Auto-detect global providers from modules
const moduleGlobalProviders = import.meta.glob(
  ['../../../apps/**/client/providers/global.tsx'],
  { eager: true, import: 'default' }
)

const GLOBAL_PROVIDERS = Object.values(moduleGlobalProviders) as React.FC<{
  children: React.ReactNode
}>[]

function Providers() {
  const open = useModalStore(state => state.open)

  const providers = useMemo(
    () =>
      // IMPORTANT: The order of these providers matters!
      // From top to bottom, they are nested inside one another in that order.
      defineProviders([
        // Providers from external packages
        [NuqsProvider],
        [QueryClientProvider, { client: queryClient }],
        [ToastProvider],
        [
          DndProvider as React.FC<{ backend: BackendFactory }>,
          { backend: HTML5Backend }
        ],

        // Provider that tells components the API endpoint to use
        [APIEndpointProvider, { endpoint: import.meta.env.VITE_API_HOST }],

        // Provider that initializes end-to-end encryption (fetches server public key)
        [EncryptionProvider, { apiHost: import.meta.env.VITE_API_HOST }],

        // Provider that stores all the theming information
        [PersonalizationProvider, { forgeAPI }],

        // Provider that checks if the API is online or not
        // A wrapper exported from lifeforge-ui is used to avoid circular dependencies
        [APIOnlineStatusProvider],
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
        // Module-specific global providers (auto-detected from apps/**/providers/global.tsx)
        ...GLOBAL_PROVIDERS.map(
          Provider => [Provider] as readonly [typeof Provider]
        ),
        // This is where all the routes are defined
        [AppRoutesProvider]
      ] as const),
    []
  )

  return constructComponentTree(providers)
}

export default Providers
