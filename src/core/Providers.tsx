// Providers.tsx
import APIOnlineStatusProvider from '@providers/APIOnlineStatusProvider'
import AuthProvider from '@providers/AuthProvider'
import BackgroundProvider from '@providers/BackgroundProvider'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import LifeforgeUIProviderWrapper from '@providers/LifeforgeUIProviderWrapper'
import { MusicProvider } from '@providers/MusicProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const queryClient = new QueryClient()

function Providers({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <APIOnlineStatusProvider>
        <GlobalStateProvider>
          <AuthProvider>
            <DndProvider backend={HTML5Backend}>
              <PersonalizationProvider>
                <LifeforgeUIProviderWrapper>
                  <BackgroundProvider>
                    <MusicProvider>{children}</MusicProvider>
                  </BackgroundProvider>
                </LifeforgeUIProviderWrapper>
              </PersonalizationProvider>
            </DndProvider>
          </AuthProvider>
        </GlobalStateProvider>
      </APIOnlineStatusProvider>
    </QueryClientProvider>
  )
}

export default Providers
