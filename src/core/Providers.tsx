// Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import APIOnlineStatusProvider from '@providers/APIOnlineStatusProvider'
import AuthProvider from '@providers/AuthProvider'
import BackgroundProvider from '@providers/BackgroundProvider'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import { MusicProvider } from '@providers/MusicProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'

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
                <BackgroundProvider>
                  <MusicProvider>{children}</MusicProvider>
                </BackgroundProvider>
              </PersonalizationProvider>
            </DndProvider>
          </AuthProvider>
        </GlobalStateProvider>
      </APIOnlineStatusProvider>
    </QueryClientProvider>
  )
}

export default Providers
