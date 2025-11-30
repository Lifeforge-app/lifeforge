import TwoFAModal from '@/auth/modals/TwoFAModal'
import AppRoutesProvider from '@/routes/providers/AppRoutesProvider'
import forgeAPI from '@/utils/forgeAPI'
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
  NuqsProvider,
  PersonalizationProvider,
  SidebarStateProvider,
  SocketProvider,
  ToastProvider
} from 'shared'

import UserPersonalizationProvider from './features/UserPersonalizationProvider'
import { constructComponentTree, defineProviders } from './utils/providerUtils'

const queryClient = new QueryClient()

function Providers() {
  const open = useModalStore(state => state.open)

  const providers = useMemo(
    () =>
      defineProviders([
        [NuqsProvider],
        [APIEndpointProvider, { endpoint: import.meta.env.VITE_API_HOST }],
        [QueryClientProvider, { client: queryClient }],
        [
          DndProvider as React.FC<{ backend: BackendFactory }>,
          { backend: HTML5Backend }
        ],
        [PersonalizationProvider],
        [APIOnlineStatusProvider],
        [APIOnlineStatusWrapper],
        [
          AuthProvider,
          {
            forgeAPI,
            onTwoFAModalOpen: () => {
              open(TwoFAModal, {})
            }
          }
        ],
        [SidebarStateProvider],
        [UserPersonalizationProvider],
        [ToastProvider],
        [BackgroundProvider],
        [SocketProvider, { apiHost: import.meta.env.VITE_API_HOST }],
        [AppRoutesProvider]
      ] as const),
    []
  )

  return constructComponentTree(providers)
}

export default Providers
