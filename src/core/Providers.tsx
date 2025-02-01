// Providers.tsx
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import APIOnlineStatusProvider from '@providers/APIOnlineStatusProvider'
import AuthProvider from '@providers/AuthProvider'
import BackgroundProvider from '@providers/BackgroundProvider'
import GlobalStateProvider from '@providers/GlobalStateProvider'
import { MusicProvider } from '@providers/MusicProvider'
import PersonalizationProvider from '@providers/PersonalizationProvider'

function Providers({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
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
  )
}

export default Providers
